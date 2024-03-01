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

[api/client.ts:55](https://github.com/pgEdge/prest-client/blob/1672b50/src/api/client.ts#L55)

## Properties

### client

• `Private` **client**: `undefined` \| \{ `get`: (`url`: `string`) => `Promise`\<`Response`\>  }

The underlying HTTP client for making requests to the Prest API.

#### Defined in

[api/client.ts:39](https://github.com/pgEdge/prest-client/blob/1672b50/src/api/client.ts#L39)

___

### options

• `Private` **options**: [`PrestApiClientOptions`](../interfaces/PrestApiClientOptions.md)

The options used to configure the client.

#### Defined in

[api/client.ts:48](https://github.com/pgEdge/prest-client/blob/1672b50/src/api/client.ts#L48)

## Accessors

### database

• `get` **database**(): `string`

Gets the name of the database to which the client is connected.

#### Returns

`string`

#### Defined in

[api/client.ts:123](https://github.com/pgEdge/prest-client/blob/1672b50/src/api/client.ts#L123)

## Methods

### Table

▸ **Table**(`tableName`, `schemaName`): `Object`

Returns an object for interacting with a specific table in the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tableName` | `string` | The name of the table. |
| `schemaName` | `undefined` \| `string` | The name of the schema to which the table belongs (optional). |

#### Returns

`Object`

An object with methods for interacting with the table.

| Name | Type |
| :------ | :------ |
| `List` | () => `Promise`\<`any`\> |

#### Defined in

[api/client.ts:96](https://github.com/pgEdge/prest-client/blob/1672b50/src/api/client.ts#L96)

___

### createClient

▸ **createClient**(): `Promise`\<`void`\>

Creates the underlying HTTP client with the necessary authentication headers.

#### Returns

`Promise`\<`void`\>

#### Defined in

[api/client.ts:63](https://github.com/pgEdge/prest-client/blob/1672b50/src/api/client.ts#L63)
