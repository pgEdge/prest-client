[Prest Client](../README.md) / PrestApiClient

# Class: PrestApiClient

A client for interacting with a Prest API.

**`Export`**

PrestApiClient

## Table of contents

### Constructors

- [constructor](PrestApiClient.md#constructor)

### Properties

- [client](PrestApiClient.md#client)
- [options](PrestApiClient.md#options)

### Accessors

- [database](PrestApiClient.md#database)

### Methods

- [Table](PrestApiClient.md#table)
- [createClient](PrestApiClient.md#createclient)

## Constructors

### constructor

• **new PrestApiClient**(`options`): [`PrestApiClient`](PrestApiClient.md)

Creates a new Prest API client with the provided options.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`PrestApiClientOptions`](../interfaces/PrestApiClientOptions.md) | The options for creating the client. |

#### Returns

[`PrestApiClient`](PrestApiClient.md)

#### Defined in

[api/client.ts:57](https://github.com/pgEdge/prest-client/blob/9d0996d/src/api/client.ts#L57)

## Properties

### client

• `Private` **client**: `undefined` \| \{ `get`: (`url`: `string`) => `Promise`\<`Response`\> ; `post`: (`url`: `string`, `body`: `any`) => `Promise`\<`Response`\> ; `put`: (`url`: `string`, `body`: `any`) => `Promise`\<`Response`\>  }

The underlying HTTP client for making requests to the Prest API.

#### Defined in

[api/client.ts:39](https://github.com/pgEdge/prest-client/blob/9d0996d/src/api/client.ts#L39)

___

### options

• `Private` **options**: [`PrestApiClientOptions`](../interfaces/PrestApiClientOptions.md)

The options used to configure the client.

#### Defined in

[api/client.ts:50](https://github.com/pgEdge/prest-client/blob/9d0996d/src/api/client.ts#L50)

## Accessors

### database

• `get` **database**(): `string`

Gets the name of the database to which the client is connected.

#### Returns

`string`

#### Defined in

[api/client.ts:281](https://github.com/pgEdge/prest-client/blob/9d0996d/src/api/client.ts#L281)

## Methods

### Table

▸ **Table**(`tableName`): `Object`

Returns an object for interacting with a specific table in the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tableName` | `undefined` \| `string` | The name of the table. |

#### Returns

`Object`

An object with methods for interacting with the table.

| Name | Type | Description |
| :------ | :------ | :------ |
| `Insert` | (`data`: `any`) => `Promise`\<`any`\> | Inserts data into the specified table. **`Throws`** An error if inserting data fails. **`Example`** ```ts const response = await client.Table('user').Insert({ user_name: 'Ronaldo', description: 'Siuuu!!!', picture: '\\x', }); // Inserts a new row into the 'user' table. // Executes POST `/:database/:schema/:table`. ``` |
| `List` | () => `Promise`\<`any`\> | Retrieves the structure of the specified table. **`Throws`** An error if fetching the table structure fails. **`Example`** ```ts const response = await client.Table('user').List(); // Queries the rows of the 'user' table. Public schema is used by default. // Executes GET `/:database/:schema/:table`. ``` **`Example`** ```ts const response = await client.Table('private.user').List(); // Retrieves the rows of the 'user' table in the 'private' schema. // Executes GET `/:database/:schema/:table`. ``` **`Example`** ```ts const response = await client.Table('public.').List(); // Retrieves a list of tables in the 'public' schema. // Executes GET `/:database/:schema`. // Note: The dot at the end is to ignore the table name. ``` |
| `Show` | () => `Promise`\<`any`\> | Retrieves data from the specified table. **`Throws`** An error if fetching data from the table fails. **`Example`** ```ts const response = await client.Table('user').Show(); // Retrieves data from the 'user' table. // Executes GET `/show/:database/:schema/:table`. ``` |
| `Update` | (`field`: `string`, `value`: `any`, `data`: `any`) => `Promise`\<`any`\> | Updates data in the specified table based on the provided field and value. **`Throws`** An error if updating data fails. **`Example`** ```ts const response = await client.Table('user').Update( 'user_id', // Field to filter by userIdToUpdate, // Value of the field to filter by { user_name: 'NewName', description: 'Updated description', picture: '\\x', } ); // Updates data in the 'user' table where 'user_id' equals 'userIdToUpdate'. // Executes PUT `/:database/:schema/:table?field=value`. ``` |

#### Defined in

[api/client.ts:129](https://github.com/pgEdge/prest-client/blob/9d0996d/src/api/client.ts#L129)

___

### createClient

▸ **createClient**(): `Promise`\<`void`\>

Creates the underlying HTTP client with the necessary authentication headers.

#### Returns

`Promise`\<`void`\>

#### Defined in

[api/client.ts:65](https://github.com/pgEdge/prest-client/blob/9d0996d/src/api/client.ts#L65)
