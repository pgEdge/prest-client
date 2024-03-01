/**
 * Options for creating a Prest API client.
 *
 * @export
 * @interface PrestApiClientOptions
 */
export interface PrestApiClientOptions {
  /**
   * The base URL of the Prest API endpoint.
   */
  base_url: string;

  /**
   * The username for authentication with the Prest API.
   */
  user_name: string;

  /**
   * The password for authentication with the Prest API.
   */
  password: string;

  /**
   * The name of the database to connect to.
   */
  database: string;
}

/**
 * A client for interacting with a Prest API.
 *
 * @export
 * @class PrestApiClient
 */
export class PrestApiClient {
  /**
   * The underlying HTTP client for making requests to the Prest API.
   */
  private client:
    | undefined
    | {
        get: (url: string) => Promise<Response>;
      };

  /**
   * The options used to configure the client.
   */
  private options: PrestApiClientOptions;

  /**
   * Creates a new Prest API client with the provided options.
   *
   * @param options - The options for creating the client.
   */
  constructor(options: PrestApiClientOptions) {
    this.options = options;
    this.createClient();
  }

  /**
   * Creates the underlying HTTP client with the necessary authentication headers.
   */
  private async createClient() {
    try {
      const username = this.options.user_name;
      const password = this.options.password;
      const authHeader = 'Basic ' + btoa(username + ':' + password);

      this.client = {
        get: async (url: string) => {
          const response = await fetch(url, {
            headers: {
              Authorization: authHeader,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
          }

          return response;
        },
      };
    } catch (error) {
      console.error('Error creating client:', error);
    }
  }

  /**
   * Returns an object for interacting with a specific table in the database.
   *
   * @param tableName - The name of the table.
   * @param schemaName - The name of the schema to which the table belongs (optional).
   * @returns An object with methods for interacting with the table.
   */
  Table(
    tableName: string,
    schemaName: string | undefined,
  ): { List: () => Promise<any> } {
    if (!this.client) {
      throw new Error('Client not initialized');
    }

    return {
      List: async () => {
        try {
          const response = await this.client!.get(
            `${this.options.base_url}/${this.database}/${schemaName ?? 'public'}/${tableName}`,
          );
          return await response.json();
        } catch (error: any) {
          throw new Error(
            `Failed to fetch data from ${tableName}: ${error.message}`,
          );
        }
      },
    };
  }

  /**
   * Gets the name of the database to which the client is connected.
   */
  get database(): string {
    return this.options.database;
  }
}