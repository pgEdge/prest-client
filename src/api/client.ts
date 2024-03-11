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

/**
 * A class that represents a chained query for interacting with a Prest API endpoint.
 *
 * This class allows you to build up a query by chaining various filter, function, and order methods.
 * Once the query is complete, you can call the `execute` method to execute the query and retrieve the results.
 */
class ChainedQuery {
  private client: PrestApiClient;
  private baseUrl: string;
  private reqType: 'get' | 'post' | 'put' | 'delete';
  private body: any;
  private renderer: 'json' | 'xml' = 'json';
  private sqlFunctions: string[] = [];
  private chainedOperations: string[];

  /**
   * Creates a new ChainedQuery instance.
   *
   * @param client - The Prest API client to use for making the request.
   * @param baseUrl - The base URL of the Prest API endpoint.
   * @param reqType - The HTTP request type ('get', 'post', 'put', or 'delete').
   * @param body - The data to send in the request body (for POST and PUT requests).
   */
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

  /**
   * Adds a page filter to the query, specifying which page of results to retrieve.
   *
   * This is useful for paginating large datasets.
   * Prest API uses a zero-based indexing for pages, where the first page is `_page=0`.
   *
   * @param pageNumber - The page number (zero-based) to retrieve.
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve the second page (10 items per page) of products
   * const query = client.Table('products').List()
   *   .Page(1)
   *   .execute();
   * ```
   */
  Page(pageNumber: number): ChainedQuery {
    this.chainedOperations.push(stringify({ _page: pageNumber }));
    return this;
  }

  /**
   * Adds a page size filter to the query, specifying the number of items to retrieve per page.
   *
   * This is useful in conjunction with `Page` to control how many results are returned at a time.
   *
   * @param pageSize - The number of items per page.
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve the first page (10 items per page) of customers
   * const query = client.Table('customers').List()
   *   .PageSize(10)
   *   .execute();
   * ```
   */
  PageSize(pageSize: number): ChainedQuery {
    this.chainedOperations.push(stringify({ _page_size: pageSize }));
    return this;
  }

  /**
   * Adds a select filter to the query, specifying which fields to retrieve from the results.
   *
   * By default, all fields are returned. Use this method to limit the response to only the fields you need.
   *
   * @param ...fields - A list of field names to select.
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve only the 'id', 'name', and 'price' fields from products
   * const query = client.Table('products').List()
   *   .Select('id', 'name', 'price')
   *   .execute();
   * ```
   */
  Select(...fields: string[]): ChainedQuery {
    this.chainedOperations.push(stringify({ _select: fields.join(',') }));
    return this;
  }

  /**
   * Adds a count filter to the query, which returns the total number of rows in the table.
   *
   * This is useful for getting the overall count of items without retrieving all results. You can optionally specify
   * a field to count. By default, all fields (`*`) are counted.
   *
   * @param field - The field to count (optional, defaults to '*').
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Count the total number of products
   * const query = client.Table('products')
   *   .Count()
   *   .execute();
   *
   * // Count the number of active users
   * const query = client.Table('users')
   *   .Count('is_active')
   *   .execute();
   * ```
   */
  Count(field?: string): ChainedQuery {
    const fieldValue = field ? field : '*';
    this.chainedOperations.push(stringify({ _count: fieldValue }));
    return this;
  }

  /**
   * Adds a count_first filter to the query, which returns either the first row or the total count.
   *
   * This is useful for checking if there are any results or retrieving the first row quickly.
   *
   * @param countFirst - A boolean value indicating whether to return the first row (true) or the total count (false).
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Check if there are any active orders
   * const query = client.Table('orders')
   *   .CountFirst(true)
   *   .execute();
   *
   * // Retrieve the first product
   * const query = client.Table('products')
   *   .CountFirst()
   *   .execute();
   * ```
   */
  CountFirst(countFirst: boolean = true): ChainedQuery {
    this.chainedOperations.push(stringify({ _count_first: countFirst }));
    return this;
  }

  /**
   * Sets the output renderer for the query results ('json' or 'xml').
   *
   * By default, the response is formatted as JSON. Use this method to specify XML instead.
   *
   * @param renderer - The desired output renderer ('json' or 'xml').
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve products in XML format
   * const query = client.Table('products')
   *   .Renderer('xml')
   *   .execute();
   * ```
   */
  Renderer(renderer: 'json' | 'xml'): ChainedQuery {
    this.chainedOperations.push(stringify({ _renderer: renderer }));
    this.renderer = renderer;
    return this;
  }

  /**
   * Adds a distinct filter to the query, which removes duplicate rows from the result set.
   *
   * This is useful when you want to retrieve unique values from a column or combination of columns.
   *
   * @param distinct - A boolean value indicating whether to apply distinct filtering (true) or not (false).
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve distinct product categories
   * const query = client.Table('products').List()
   *   .Distinct(true)
   *   .execute();
   * ```
   */
  Distinct(distinct: boolean = true): ChainedQuery {
    this.chainedOperations.push(stringify({ _distinct: distinct }));
    return this;
  }

  /**
   * Adds an order filter to the query, specifying the order in which the results should be returned.
   *
   * Use a minus sign (-) prefix to indicate descending order for a field.
   *
   * @param ...fields - A list of field names to order by. Prefix field names with '-' for descending order.
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve products ordered by price in descending order
   * const query = client.Table('products').List()
   *   .Order('-price')
   *   .execute();
   *
   * // Retrieve products ordered by price in ascending order, then by name in descending order
   * const query = client.Table('products').List()
   *   .Order('price', '-name')
   *   .execute();
   * ```
   */
  Order(...fields: string[]): ChainedQuery {
    const orderFields = fields.map((field) =>
      field.startsWith('-') ? field : `${field}`,
    );
    this.chainedOperations.push(stringify({ _order: orderFields.join(',') }));
    return this;
  }

  /**
   * Adds a group by filter to the query, grouping the results based on the specified fields.
   *
   * This is useful when you want to perform aggregate functions (such as SUM, AVG, etc.) on grouped data.
   *
   * @param ...fields - A list of field names to group by.
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve total sales amount grouped by product category
   * const query = client.Table('sales').List()
   *   .GroupBy('product_category')
   *   .Sum('sales_amount')
   *   .execute();
   * ```
   */
  GroupBy(...fields: string[]): ChainedQuery {
    this.chainedOperations.push(stringify({ _groupby: fields.join(',') }));
    return this;
  }

  /**
   * Adds an equal filter to the query, specifying that a field must be equal to a certain value.
   *
   * @param field - The field to filter by.
   * @param value - The value that the field must be equal to.
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve products with the 'category' field equal to 'electronics'
   * const query = client.Table('products').List()
   *   .FilterEqual('category', 'electronics')
   *   .execute();
   * ```
   */
  FilterEqual(field: string, value: any): ChainedQuery {
    this.chainedOperations.push(`${field}=${encodeURIComponent(value)}`);
    return this;
  }
  /**
   * Adds a Sum function to the query, calculating the sum of values in the specified field.
   *
   * This is useful when you want to aggregate numerical values across grouped data.
   *
   * @param field - The field for which to calculate the sum.
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve the sum of category IDs grouped by category
   * const query = client.Table('categories').List()
   *   .GroupBy('category_id')
   *   .Sum('category_id')
   *   .execute();
   * ```
   */
  Sum(field: string): ChainedQuery {
    this.sqlFunctions.push(`sum:${field}`);
    return this;
  }

  /**
   * Adds an Avg function to the query, calculating the average of values in the specified field.
   *
   * This is useful when you want to find the average value of a numerical field across grouped data.
   *
   * @param field - The field for which to calculate the average.
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve the average of category IDs grouped by category
   * const query = client.Table('categories').List()
   *   .GroupBy('category_id')
   *   .Avg('category_id')
   *   .execute();
   * ```
   */
  Avg(field: string): ChainedQuery {
    this.sqlFunctions.push(`avg:${field}`);
    return this;
  }

  /**
   * Adds a Max function to the query, finding the maximum value in the specified field.
   *
   * This is useful when you want to find the maximum value of a field across grouped data.
   *
   * @param field - The field for which to find the maximum value.
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve the maximum category ID grouped by category
   * const query = client.Table('categories').List()
   *   .GroupBy('category_id')
   *   .Max('category_id')
   *   .execute();
   * ```
   */
  Max(field: string): ChainedQuery {
    this.sqlFunctions.push(`max:${field}`);
    return this;
  }

  /**
   * Adds a Min function to the query, finding the minimum value in the specified field.
   *
   * This is useful when you want to find the minimum value of a field across grouped data.
   *
   * @param field - The field for which to find the minimum value.
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve the minimum category ID grouped by category
   * const query = client.Table('categories').List()
   *   .GroupBy('category_id')
   *   .Min('category_id')
   *   .execute();
   * ```
   */
  Min(field: string): ChainedQuery {
    this.sqlFunctions.push(`min:${field}`);
    return this;
  }

  /**
   * Adds a StdDev function to the query, calculating the standard deviation of values in the specified field.
   *
   * This is useful when you want to analyze the variability of numerical data across grouped data.
   *
   * @param field - The field for which to calculate the standard deviation.
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve the standard deviation of category IDs grouped by category
   * const query = client.Table('categories').List()
   *   .GroupBy('category_id')
   *   .StdDev('category_id')
   *   .execute();
   * ```
   */
  StdDev(field: string): ChainedQuery {
    this.sqlFunctions.push(`stddev:${field}`);
    return this;
  }

  /**
   * Adds a Variance function to the query, calculating the variance of values in the specified field.
   *
   * This is useful when you want to measure the spread or dispersion of numerical data across grouped data.
   *
   * @param field - The field for which to calculate the variance.
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve the variance of category IDs grouped by category
   * const query = client.Table('categories').List()
   *   .GroupBy('category_id')
   *   .Variance('category_id')
   *   .execute();
   * ```
   */
  Variance(field: string): ChainedQuery {
    this.sqlFunctions.push(`variance:${field}`);
    return this;
  }

  /**
   * Adds a Having filter to the query, specifying a condition for aggregated values after grouping.
   *
   * This is useful when you want to filter grouped results based on aggregated values.
   *
   * @param groupFunc - The aggregation function to apply the condition to (e.g., 'sum', 'avg', 'min', 'max', etc.).
   * @param field - The field to which the condition applies.
   * @param condition - The condition operator (e.g., '$gt', '$lt', '$eq', etc.).
   * @param value - The value to compare against.
   * @returns The ChainedQuery instance to allow for method chaining.
   *
   * @example
   * ```typescript
   * // Retrieve categories where the sum of category IDs is greater than 5
   * const query = client.Table('categories').List()
   *   .GroupBy('category_id')
   *   .Sum('category_id')
   *   .Having('sum', 'category_id', '$gt', 5)
   *   .execute();
   * ```
   */
  Having(
    groupFunc: string,
    field: string,
    condition: string,
    value: any,
  ): ChainedQuery {
    const havingClause = `having:${groupFunc}:${field}:${condition}:${encodeURIComponent(value)}`;
    this.chainedOperations.push(havingClause);
    return this;
  }

  // FilterOperators(operator: string, field: string, value: any): ChainedQuery {
  //   const filterClause = `${operator}:${field}:${encodeURIComponent(value)}`;
  //   this.chainedOperations.push(filterClause);
  //   return this;
  // }

  FilterRange(field: string, start: any, end: any): ChainedQuery {
    if (start !== undefined) {
      this.chainedOperations.push(`${field}=$gte.${encodeURIComponent(start)}`);
    }
    if (end !== undefined) {
      this.chainedOperations.push(`${field}=$lte.${encodeURIComponent(end)}`);
    }
    return this;
  }

  Join(
    joinType: 'inner' | 'left' | 'right' | 'outer',
    joinTable: string,
    localField: string,
    operator: string,
    foreignField: string,
  ): ChainedQuery {
    const joinClause = `_join=${joinType}:${joinTable}:${localField}:${operator}:${foreignField}`;
    this.chainedOperations.push(joinClause);
    return this;
  }

  JSONbFilter(field: string, jsonField: string, value: any): ChainedQuery {
    const filterClause = `${field}->>${jsonField}:jsonb=${encodeURIComponent(value)}`;
    this.chainedOperations.push(filterClause);
    return this;
  }

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
