import { stringify } from 'querystring';

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

class ChainedQuery {
  private client: PrestApiClient;
  private baseUrl: string;
  private reqType: 'get' | 'post' | 'put' | 'delete';
  private body: any;
  private renderer: 'json' | 'xml' = 'json';
  private sqlFunctions: string[] = [];
  private chainedOperations: string[];

  constructor(
    client: PrestApiClient,
    baseUrl: string,
    reqType: 'get' | 'post' | 'put' | 'delete',
    body: any,
  ) {
    this.client = client;
    this.baseUrl = baseUrl;
    this.reqType = reqType;
    this.body = body;
    this.chainedOperations = [];
  }

  //filter methods start
  Page(pageNumber: number): ChainedQuery {
    this.chainedOperations.push(stringify({ _page: pageNumber }));
    return this;
  }

  PageSize(pageSize: number): ChainedQuery {
    this.chainedOperations.push(stringify({ _page_size: pageSize }));
    return this;
  }

  Select(...fields: string[]): ChainedQuery {
    this.chainedOperations.push(stringify({ _select: fields.join(',') }));
    return this;
  }

  Count(field?: string): ChainedQuery {
    const fieldValue = field ? field : '*';
    this.chainedOperations.push(stringify({ _count: fieldValue }));
    return this;
  }

  CountFirst(countFirst: boolean = true): ChainedQuery {
    this.chainedOperations.push(stringify({ _count_first: countFirst }));
    return this;
  }

  Renderer(renderer: 'json' | 'xml'): ChainedQuery {
    this.chainedOperations.push(stringify({ _renderer: renderer }));
    this.renderer = renderer;
    return this;
  }

  Distinct(distinct: boolean = true): ChainedQuery {
    this.chainedOperations.push(stringify({ _distinct: distinct }));
    return this;
  }

  Order(...fields: string[]): ChainedQuery {
    const orderFields = fields.map((field) =>
      field.startsWith('-') ? field : `${field}`,
    );
    this.chainedOperations.push(stringify({ _order: orderFields.join(',') }));
    return this;
  }

  GroupBy(...fields: string[]): ChainedQuery {
    this.chainedOperations.push(stringify({ _groupby: fields.join(',') }));
    return this;
  }

  FilterEqual(field: string, value: any): ChainedQuery {
    this.chainedOperations.push(`${field}=${encodeURIComponent(value)}`);
    return this;
  }
  //filter methods end

  //function methods start
  Sum(field: string): ChainedQuery {
    this.sqlFunctions.push(`sum:${field}`);
    return this;
  }

  Avg(field: string): ChainedQuery {
    this.sqlFunctions.push(`avg:${field}`);
    return this;
  }

  Max(field: string): ChainedQuery {
    this.sqlFunctions.push(`max:${field}`);
    return this;
  }

  Min(field: string): ChainedQuery {
    this.sqlFunctions.push(`min:${field}`);
    return this;
  }

  StdDev(field: string): ChainedQuery {
    this.sqlFunctions.push(`stddev:${field}`);
    return this;
  }

  Variance(field: string): ChainedQuery {
    this.sqlFunctions.push(`variance:${field}`);
    return this;
  }

  Having(
    groupFunc: string,
    field: string,
    condition: '$eq' | '$gt' | '$lt',
    value: any,
  ): ChainedQuery {
    const havingClause = `having:${groupFunc}:${field}:${condition}:${encodeURIComponent(value)}`;
    this.chainedOperations.push(havingClause);
    return this;
  }
  //function methods end

  /**
   * Executes the chained query operations and returns the result.
   *
   * @returns A promise that resolves with the query result.
   */
  async execute(): Promise<any> {
    let chainedUrl = this.baseUrl;

    if (this.chainedOperations.length > 0) {
      chainedUrl += `?${this.chainedOperations[0]}`;

      for (let i = 1; i < this.chainedOperations.length; i++) {
        chainedUrl += `&${this.chainedOperations[i]}`;
      }
    }

    if (this.sqlFunctions.length > 0) {
      chainedUrl += `&_select=${this.sqlFunctions.join(',')}`;
    }

    try {
      console.log(chainedUrl);
      const httpClientMethod = this.client.getHttpClientMethod(this.reqType);
      const response = await httpClientMethod(chainedUrl, this.body);

      if (this.renderer === 'json') {
        return response.json();
      } else {
        return response.text();
      }
    } catch (error: any) {
      throw new Error(`Failed to make API request: ${error.message}`);
    }
  }
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
        post: (url: string, body: any) => Promise<Response>;
        put: (url: string, body: any) => Promise<Response>;
        delete: (url: string) => Promise<Response>;
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
        post: async (url: string, body: any) => {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader,
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            throw new Error(`Failed to insert data: ${response.statusText}`);
          }

          return response;
        },
        put: async (url: string, body: any) => {
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authHeader,
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            throw new Error(`Failed to update data: ${response.statusText}`);
          }

          return response;
        },
        delete: async (url: string) => {
          const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              Authorization: authHeader,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to delete data: ${response.statusText}`);
          }

          return response;
        },
      };
    } catch (error) {
      console.error('Error creating client:', error);
    }
  }

  /**
   * Returns the appropriate HTTP client method for making the API request.
   *
   * @param method - The HTTP method to use ('get', 'post', 'put', or 'delete').
   * @returns The corresponding HTTP client method.
   * @throws An error if the client is not initialized or the method is invalid.
   */
  getHttpClientMethod(method: 'get' | 'post' | 'put' | 'delete') {
    if (!this.client) {
      throw new Error('Client not initialized');
    }

    switch (method) {
      case 'get':
        return this.client.get;
      case 'post':
        return this.client.post;
      case 'put':
        return this.client.put;
      case 'delete':
        return this.client.delete;
      default:
        throw new Error('Invalid HTTP method');
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
    List: () => ChainedQuery;

    /**
     * Retrieves data from the specified table.
     *
     * @returns A promise that resolves with the data from the table.
     * @throws An error if fetching data from the table fails.
     *
     * @example
     * const response = await client.Table('user').Show();
     * // Retrieves data from the 'user' table.
     * // Executes GET `/show/:database/:schema/:table`.
     */
    Show: () => ChainedQuery;

    /**
     * Inserts data into the specified table.
     *
     * @param data - The data to insert, structured as a JavaScript object with properties matching the table's columns.
     * @returns A promise that resolves with the inserted data, including any generated IDs or timestamps.
     * @throws An error if inserting data fails.
     *
     * @example
     * const response = await client.Table('user').Insert({
     *   user_name: 'Ronaldo',
     *   description: 'Siuuu!!!',
     *   picture: '\\x',
     * });
     * // Inserts a new row into the 'user' table.
     * // Executes POST `/:database/:schema/:table`.
     */
    Insert: (data: any) => ChainedQuery;

    /**
     * Updates data in the specified table based on the provided field and value.
     *
     * @param field - The field to filter by for updating.
     * @param value - The value of the field to filter by for updating.
     * @param data - The data to update, structured as a JavaScript object with properties matching the table's columns.
     * @returns A promise that resolves with the updated data.
     * @throws An error if updating data fails.
     *
     * @example
     * const response = await client.Table('user').Update(
     *   'user_id', // Field to filter by
     *   userIdToUpdate, // Value of the field to filter by
     *   {
     *     user_name: 'NewName',
     *     description: 'Updated description',
     *     picture: '\\x',
     *   }
     * );
     * // Updates data in the 'user' table where 'user_id' equals 'userIdToUpdate'.
     * // Executes PUT `/:database/:schema/:table?field=value`.
     */
    Update: (data: any) => ChainedQuery;

    /**
     * Deletes data from the specified table based on the provided field and value.
     *
     * @param field - The field to filter by for deletion.
     * @param value - The value of the field to filter by for deletion.
     * @returns A promise that resolves when the data is successfully deleted.
     * @throws An error if deleting data fails.
     *
     * @example
     * const response = await client.Table('user').Delete(
     *   'user_id', // Field to filter by
     *   userIdToDelete // Value of the field to filter by
     * );
     * // Deletes data from the 'user' table where 'user_id' equals 'userIdToDelete'.
     * // Executes DELETE `/:database/:schema/:table?field=value`.
     */
    Delete: () => ChainedQuery;
  } {
    if (!this.client) {
      throw new Error('Client not initialized');
    }

    if (!tableName) {
      throw new Error('Table name is required');
    }

    let schemaName: string = 'public';
    if (tableName.includes('.')) {
      const parts = tableName.split('.');
      schemaName = parts[0] || schemaName;
      tableName = parts[1];
    }

    return {
      List: (): ChainedQuery => {
        const baseUrl = `${this.base_url}/${this.database}/${schemaName}/${tableName}`;
        return new ChainedQuery(this, baseUrl, 'get', null);
      },

      Show: (): ChainedQuery => {
        const baseUrl = `${this.base_url}/show/${this.database}/${schemaName}/${tableName}`;
        return new ChainedQuery(this, baseUrl, 'get', null);
      },
      Insert: (data: any): ChainedQuery => {
        const baseUrl = `${this.base_url}/${this.database}/${schemaName}/${tableName}`;
        return new ChainedQuery(this, baseUrl, 'post', data);
      },
      Update: (data: any): ChainedQuery => {
        const baseUrl = `${this.base_url}/${this.database}/${schemaName}/${tableName}`;
        return new ChainedQuery(this, baseUrl, 'put', data);
      },
      Delete: (): ChainedQuery => {
        const baseUrl = `${this.base_url}/${this.database}/${schemaName}/${tableName}`;
        return new ChainedQuery(this, baseUrl, 'delete', null);
      },
    };
  }

  /**
   * Gets the name of the database to which the client is connected.
   */
  get database(): string {
    return this.options.database;
  }

  /**
   * Gets the base URL of the Prest API endpoint to which the client is connected.
   */
  get base_url(): string {
    return this.options.base_url;
  }
}
