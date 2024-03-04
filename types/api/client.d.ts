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
         * // Retrieves data from the 'user' table.
         * // Executes GET `/show/:database/:schema/:table`.
         */
        Show: () => Promise<any>;
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
        Insert: (data: any) => Promise<any>;
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
        Update: (field: string, value: any, data: any) => Promise<any>;
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
        Delete: (field: string, value: any) => Promise<any>;
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
//# sourceMappingURL=client.d.ts.map