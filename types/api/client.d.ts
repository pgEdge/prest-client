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
declare class ChainedQuery {
    private client;
    private baseUrl;
    private reqType;
    private body;
    private rendererArg;
    private sqlFunctions;
    private chainedOperations;
    /**
     * Creates a new ChainedQuery instance.
     *
     * @param client - The Prest API client to use for making the request.
     * @param baseUrl - The base URL of the Prest API endpoint.
     * @param reqType - The HTTP request type ('get', 'post', 'put', or 'delete').
     * @param body - The data to send in the request body (for POST and PUT requests).
     */
    constructor(client: PrestApiClient, baseUrl: string, reqType: 'get' | 'post' | 'put' | 'delete', body: any);
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
     * const query = client.table('products').list()
     *   .page(1)
     *   .execute();
     * ```
     */
    page(pageNumber: number): ChainedQuery;
    /**
     * Adds a page size filter to the query, specifying the number of items to retrieve per page.
     *
     * This is useful in conjunction with `page` to control how many results are returned at a time.
     *
     * @param pageSize - The number of items per page.
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve the first page (10 items per page) of customers
     * const query = client.table('customers').list()
     *   .pageSize(10)
     *   .execute();
     * ```
     */
    pageSize(pageSize: number): ChainedQuery;
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
     * const query = client.table('products').list()
     *   .select('id', 'name', 'price')
     *   .execute();
     * ```
     */
    select(...fields: string[]): ChainedQuery;
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
     * const query = client.table('products')
     *   .count()
     *   .execute();
     *
     * // Count the number of active users
     * const query = client.table('users')
     *   .count('is_active')
     *   .execute();
     * ```
     */
    count(field?: string): ChainedQuery;
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
     * const query = client.table('orders')
     *   .countFirst(true)
     *   .execute();
     *
     * // Retrieve the first product
     * const query = client.table('products')
     *   .countFirst()
     *   .execute();
     * ```
     */
    countFirst(countFirst?: boolean): ChainedQuery;
    /**
     * Sets the output renderer for the query results ('json' or 'xml').
     *
     * By default, the response is formatted as JSON. Use this method to specify XML instead.
     *
     * @param rendererArg - The desired output renderer ('json' or 'xml').
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Retrieve products in XML format
     * const query = client.table('products')
     *   .renderer('xml')
     *   .execute();
     * ```
     */
    renderer(rendererArg: 'json' | 'xml'): ChainedQuery;
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
     * const query = client.table('products').list()
     *   .distinct(true)
     *   .execute();
     * ```
     */
    distinct(distinct?: boolean): ChainedQuery;
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
     * const query = client.table('products').list()
     *   .order('-price')
     *   .execute();
     *
     * // Retrieve products ordered by price in ascending order, then by name in descending order
     * const query = client.table('products').list()
     *   .order('price', '-name')
     *   .execute();
     * ```
     */
    order(...fields: string[]): ChainedQuery;
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
     * const query = client.table('sales').list()
     *   .groupBy('product_category')
     *   .sum('sales_amount')
     *   .execute();
     * ```
     */
    groupBy(...fields: string[]): ChainedQuery;
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
     * const query = client.table('products').list()
     *   .filterEqual('category', 'electronics')
     *   .execute();
     * ```
     */
    filterEqual(field: string, value: any): ChainedQuery;
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
     * const query = client.table('categories').list()
     *   .groupBy('category_id')
     *   .sum('category_id')
     *   .execute();
     * ```
     */
    sum(field: string): ChainedQuery;
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
     * const query = client.table('categories').list()
     *   .groupBy('category_id')
     *   .avg('category_id')
     *   .execute();
     * ```
     */
    avg(field: string): ChainedQuery;
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
     * const query = client.table('categories').list()
     *   .groupBy('category_id')
     *   .max('category_id')
     *   .execute();
     * ```
     */
    max(field: string): ChainedQuery;
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
     * const query = client.table('categories').list()
     *   .groupBy('category_id')
     *   .min('category_id')
     *   .execute();
     * ```
     */
    min(field: string): ChainedQuery;
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
     * const query = client.table('categories').list()
     *   .groupBy('category_id')
     *   .stdDev('category_id')
     *   .execute();
     * ```
     */
    stdDev(field: string): ChainedQuery;
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
     * const query = client.table('categories').list()
     *   .groupBy('category_id')
     *   .variance('category_id')
     *   .execute();
     * ```
     */
    variance(field: string): ChainedQuery;
    /**
     * Adds a having filter to the query, specifying a condition for aggregated values after grouping.
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
     * const query = client.table('categories').list()
     *   .groupBy('category_id')
     *   .sum('category_id')
     *   .having('sum', 'category_id', '$gt', 5)
     *   .execute();
     * ```
     */
    having(groupFunc: string, field: string, condition: string, value: any): ChainedQuery;
    /**
     * Filters results based on a field being within a specific range.
     *
     * @param field The name of the field to filter on.
     * @param start (optional) The lower bound of the range (inclusive).
     * @param end (optional) The upper bound of the range (inclusive).
     * @returns A chained query object for further building the query.
     *
     * @example
     * ```typescript
     * // Filter categories where 'category_id' is between 200 and 300 (inclusive)
     * const response = await client
     *   .table('categories')
     *   .list()
     *   .filterRange('category_id', 200, 300)
     *   .execute();
     * ```
     *
     * @example
     * // Filter categories where 'category_id' is greater than or equal to 200
     * const response = await client
     *   .table('categories')
     *   .list()
     *   .filterRange('category_id', 200)
     *   .execute();
     * ```
     */
    filterRange(field: string, start?: any, end?: any): ChainedQuery;
    /**
     * Performs a join between tables.
     *
     * @param type The type of join to perform (e.g., 'inner', 'left', 'right').
     * @param table The name of the table to join with.
     * @param leftField The field name from the current table.
     * @param operator The comparison operator to use (e.g., '$eq', '$gt', '$lt').
     * @param rightField The field name from the joined table.
     * @returns A chained query object for further building the query.
     *
     * @example
     * ```typescript
     * // Perform an inner join between 'categories' and 'products' tables
     * const response = await client
     *   .table('categories')
     *   .list()
     *   .join(
     *     'inner',
     *     'products',
     *     'categories.category_id',
     *     '$eq',
     *     'products.category_id',
     *   )
     *   .execute();
     * ```
     */
    join(joinType: 'inner' | 'left' | 'right' | 'outer', jointable: string, localField: string, operator: string, foreignField: string): ChainedQuery;
    /**
     * Filters results based on a JSON field using a JSONB path expression.
     *
     * @param field The name of the JSON field to filter on.
     * @param path The JSONB path expression to use for filtering.
     * @param value The value to compare against the path in the JSON field.
     * @returns A chained query object for further building the query.
     *
     * @example
     * ```typescript
     * // Assuming a 'mock_json' table with a 'jsonb_data' field containing JSON data
     * const response = await client
     *   .table('mock_json')
     *   .list()
     *   .jsonbFilter('jsonb_data', 'tags', 1)
     *   .execute();
     * ```
     */
    jsonbFilter(field: string, jsonField: string, value: any): ChainedQuery;
    /**
     * Adds a full-text search filter to the query using tsquery syntax.
     *
     * @param field - The field to perform the text search on.
     * @param query - The tsquery string representing the search query.
     * @param language - The language to tokenize the query in (optional).
     * @returns The ChainedQuery instance to allow for method chaining.
     *
     * @example
     * ```typescript
     * // Perform a full-text search for documents containing 'fat' and 'rat'
     * const query = client.table('documents').list()
     *   .textSearch('content', 'fat & rat')
     *   .execute();
     *
     * // Perform a full-text search in Portuguese language for documents containing 'gato' and 'cão'
     * const query = client.table('documents').list()
     *   .textSearch('content', 'gato & cão', 'portuguese')
     *   .execute();
     * ```
     */
    textSearch(field: string, query: string, language?: string): ChainedQuery;
    /**
     * Executes the chained query operations and returns the result.
     *
     * @returns A promise that resolves with the query result.
     */
    execute(): Promise<any>;
}
/**
 * A client for interacting with a Prest API.
 *
 * @export
 * @class PrestApiClient
 */
export declare class PrestApiClient {
    /**
     * The underlying HTTP client for making requests to the Prest API.
     */
    private client;
    /**
     * The options used to configure the client.
     */
    private options;
    /**
     * Creates a new Prest API client with the provided options.
     *
     * @param options - The options for creating the client.
     */
    constructor(options: PrestApiClientOptions);
    /**
     * Creates the underlying HTTP client with the necessary authentication headers.
     */
    private createClient;
    /**
     * Returns the appropriate HTTP client method for making the API request.
     *
     * @param method - The HTTP method to use ('get', 'post', 'put', or 'delete').
     * @returns The corresponding HTTP client method.
     * @throws An error if the client is not initialized or the method is invalid.
     */
    getHttpClientMethod(method: 'get' | 'post' | 'put' | 'delete'): (url: string, body: any) => Promise<Response>;
    /**
     * Returns an object for interacting with a specific table in the database.
     *
     * @param tableName - The name of the table.
     * @returns An object with methods for interacting with the table.
     */
    table(tableName: string | undefined): {
        /**
         * Retrieves the structure of the specified table.
         *
         * @returns A promise that resolves with the table structure.
         * @throws An error if fetching the table structure fails.
         *
         * @example
         * const response = await client.table('user').list();
         * // Queries the rows of the 'user' table. Public schema is used by default.
         * // Executes GET `/:database/:schema/:table`.
         *
         * @example
         * const response = await client.table('private.user').list();
         * // Retrieves the rows of the 'user' table in the 'private' schema.
         * // Executes GET `/:database/:schema/:table`.
         *
         * @example
         * const response = await client.table('public.').list();
         * // Retrieves a list of tables in the 'public' schema.
         * // Executes GET `/:database/:schema`.
         * // Note: The dot at the end is to ignore the table name.
         */
        list: () => ChainedQuery;
        /**
         * Retrieves data from the specified table.
         *
         * @returns A promise that resolves with the data from the table.
         * @throws An error if fetching data from the table fails.
         *
         * @example
         * const response = await client.table('user').show();
         * // Retrieves data from the 'user' table.
         * // Executes GET `/show/:database/:schema/:table`.
         */
        show: () => ChainedQuery;
        /**
         * Inserts data into the specified table.
         *
         * @param data - The data to insert, structured as a JavaScript object with properties matching the table's columns.
         * @returns A promise that resolves with the inserted data, including any generated IDs or timestamps.
         * @throws An error if inserting data fails.
         *
         * @example
         * const response = await client.table('user').insert({
         *   user_name: 'Ronaldo',
         *   description: 'Siuuu!!!',
         *   picture: '\\x',
         * });
         * // Inserts a new row into the 'user' table.
         * // Executes POST `/:database/:schema/:table`.
         */
        insert: (data: any) => ChainedQuery;
        /**
         * Inserts multiple rows of data into the table in a single request.
         *
         * @param data An array of objects representing the data to insert.
         *                 Each object should have properties matching the table's columns.
         * @returns A promise resolving to an array containing the inserted rows.
         *         Each row will have the same structure as the provided data objects,
         *         including any server-generated values (e.g., auto-incrementing IDs).
         *
         * @example
         * ```typescript
         * const data = [
         *   {
         *     category_name: 'Category 1',
         *     description: 'Description 1',
         *     picture: '\\x',
         *   },
         *   {
         *     category_name: 'Category 2',
         *     description: 'Description 2',
         *     picture: '\\x',
         *   },
         * ];
         *
         * const response = await client
         *   .table('categories')
         *   .batchInsert(data)
         *   .execute();
         *
         * console.log(response);
         * // response will be an array of inserted objects with potentially added server-generated IDs
         * ```
         */
        batchInsert: (data: any[]) => ChainedQuery;
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
         * const response = await client.table('user').update(
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
        update: (data: any) => ChainedQuery;
        /**
         * Deletes data from the specified table based on the provided field and value.
         *
         * @param field - The field to filter by for deletion.
         * @param value - The value of the field to filter by for deletion.
         * @returns A promise that resolves when the data is successfully deleted.
         * @throws An error if deleting data fails.
         *
         * @example
         * const response = await client.table('user').delete(
         *   'user_id', // Field to filter by
         *   userIdToDelete // Value of the field to filter by
         * );
         * // Deletes data from the 'user' table where 'user_id' equals 'userIdToDelete'.
         * // Executes DELETE `/:database/:schema/:table?field=value`.
         */
        delete: () => ChainedQuery;
    };
    /**
     * Gets the name of the database to which the client is connected.
     */
    get database(): string;
    /**
     * Gets the base URL of the Prest API endpoint to which the client is connected.
     */
    get base_url(): string;
}
export {};
//# sourceMappingURL=client.d.ts.map