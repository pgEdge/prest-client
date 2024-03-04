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
   * @returns An object with methods for interacting with the table.
   */
  Table(tableName: string | undefined): {
    /**
     * Retrieves the structure of the specified table.
     *
     * @returns A promise that resolves with the table structure.
     * @throws An error if fetching the table structure fails.
     *
     * @example
     * const response = await client.Table('user').List();
     * // Queries the rows of the 'user' table. Public schema is used by default.
     * // Executes GET `/:database/:schema/:table`.
     *
     * @example
     * const response = await client.Table('private.user').List();
     * // Retrieves the rows of the 'user' table in the 'private' schema.
     * // Executes GET `/:database/:schema/:table`.
     *
     * @example
     * const response = await client.Table('public.').List();
     * // Retrieves a list of tables in the 'public' schema.
     * // Executes GET `/:database/:schema`.
     * // Note: The dot at the end is to ignore the table name.
     */
    List: () => Promise<any>;

    /**
     * Retrieves data from the specified table.
     *
     * @returns A promise that resolves with the data from the table.
     * @throws An error if fetching data from the table fails.
     *
     * @example
     * const response = await client.Table('user').Show();
     * // Retrieves data from the 'categories' table.
     * // Executes GET `/show/:database/:schema/:table`.
     */
    Show: () => Promise<any>;
  } {
    if (!this.client) {
      throw new Error('Client not initialized');
    }

    if (!tableName) {
      throw new Error('Table name is required');
    }

    let schemaName: string | undefined;
    if (tableName.includes('.')) {
      const parts = tableName.split('.');
      schemaName = parts[0];
      tableName = parts[1];
    } else {
      schemaName = 'public';
    }

    return {
      List: async () => {
        try {
          const response = await this.client!.get(
            `${this.options.base_url}/${this.database}/${schemaName}/${tableName}`,
          );
          return await response.json();
        } catch (error: any) {
          throw new Error(
            `Failed to fetch data from ${tableName}: ${error.message}`,
          );
        }
      },
      Show: async () => {
        try {
          const response = await this.client!.get(
            `${this.options.base_url}/show/${this.database}/${schemaName}/${tableName}`,
          );
          return await response.json();
        } catch (error: any) {
          throw new Error(
            `Failed to show data for ${tableName}: ${error.message}`,
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
