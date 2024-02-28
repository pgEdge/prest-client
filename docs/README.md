Prest Client

# Prest Client

## Table of contents

### Type Aliases

- [Username](README.md#username)

### Functions

- [isValidUsername](README.md#isvalidusername)
- [parseSafeInt](README.md#parsesafeint)

## Type Aliases

### Username

Ƭ **Username**: `string` & \{ `isUsername`: unique `symbol`  }

A type representing a valid username. Must start with a letter,
contain only alphanumeric characters or underscores, and be between 3 and 15 characters long.

#### Defined in

[index.ts:5](https://github.com/pgEdge/prest-client/blob/3b78fbb/src/index.ts#L5)

## Functions

### isValidUsername

▸ **isValidUsername**(`value`): value is Username

Check if a string is a valid username based on the defined criteria.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string to be validated. |

#### Returns

value is Username

Whether the string is a valid username.

#### Defined in

[index.ts:12](https://github.com/pgEdge/prest-client/blob/3b78fbb/src/index.ts#L12)

___

### parseSafeInt

▸ **parseSafeInt**(`value`): `number`

Parse a string into a safe integer, throwing an error if the parsing fails.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | The string to be parsed. |

#### Returns

`number`

The parsed integer value.

#### Defined in

[index.ts:22](https://github.com/pgEdge/prest-client/blob/3b78fbb/src/index.ts#L22)
