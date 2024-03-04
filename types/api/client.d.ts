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
    };
    /**
     * Gets the name of the database to which the client is connected.
     */
    get database(): string;
}
//# sourceMappingURL=client.d.ts.map