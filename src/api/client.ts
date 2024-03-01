export interface PrestApiClientOptions {
  base_url: string;
  user_name: string;
  password: string;
  database: string;
}

export class PrestApiClient {
  private client: undefined | {
    get: (url: string) => Promise<Response>;
  };
  private options: PrestApiClientOptions;

  constructor(options: PrestApiClientOptions) {
    this.options = options;


    this.createClient();

  }

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
      console.error("Error creating client:", error);
    }
  }

  Table(tableName: string, schemaName: string | undefined): { List: () => Promise<any> } {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    return {
      List: async () => {
        try {
          const response = await this.client!.get(`${this.options.base_url}/${this.database}/${schemaName ?? "public"}/${tableName}`);
          return await response.json();
        } catch (error: any) {
          throw new Error(`Failed to fetch data from ${tableName}: ${error.message}`);
        }
      },
    };
  }

  get database() {
    return this.options.database;
  }
}
