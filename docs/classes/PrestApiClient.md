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

[api/client.ts:55](https://github.com/pgEdge/prest-client/blob/fff97f2/src/api/client.ts#L55)

## Properties

### client

• `Private` **client**: `undefined` \| \{ `get`: (`url`: `string`) => `Promise`\<`Response`\>  }

The underlying HTTP client for making requests to the Prest API.

#### Defined in

[api/client.ts:39](https://github.com/pgEdge/prest-client/blob/fff97f2/src/api/client.ts#L39)

___

### options

• `Private` **options**: [`PrestApiClientOptions`](../interfaces/PrestApiClientOptions.md)

The options used to configure the client.

#### Defined in

[api/client.ts:48](https://github.com/pgEdge/prest-client/blob/fff97f2/src/api/client.ts#L48)

## Accessors

### database

• `get` **database**(): `string`

Gets the name of the database to which the client is connected.

#### Returns

`string`

#### Defined in

[api/client.ts:181](https://github.com/pgEdge/prest-client/blob/fff97f2/src/api/client.ts#L181)

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
| `List` | () => `Promise`\<`any`\> | Retrieves the structure of the specified table. **`Throws`** An error if fetching the table structure fails. **`Example`** ```ts const response = await client.Table('user').List(); // Queries the rows of the 'user' table. Public schema is used by default. // Executes GET `/:database/:schema/:table`. ``` **`Example`** ```ts const response = await client.Table('private.user').List(); // Retrieves the rows of the 'user' table in the 'private' schema. // Executes GET `/:database/:schema/:table`. ``` **`Example`** ```ts const response = await client.Table('public.').List(); // Retrieves a list of tables in the 'public' schema. // Executes GET `/:database/:schema`. // Note: The dot at the end is to ignore the table name. ``` |
| `Show` | () => `Promise`\<`any`\> | Retrieves data from the specified table. **`Throws`** An error if fetching data from the table fails. **`Example`** ```ts const response = await client.Table('user').Show(); // Retrieves data from the 'categories' table. // Executes GET `/show/:database/:schema/:table`. ``` |

#### Defined in

[api/client.ts:95](https://github.com/pgEdge/prest-client/blob/fff97f2/src/api/client.ts#L95)

___

### createClient

▸ **createClient**(): `Promise`\<`void`\>

Creates the underlying HTTP client with the necessary authentication headers.

#### Returns

`Promise`\<`void`\>

#### Defined in

[api/client.ts:63](https://github.com/pgEdge/prest-client/blob/fff97f2/src/api/client.ts#L63)
