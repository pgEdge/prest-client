# Prest Client

[![Continuous Integrations](https://github.com/pgEdge/prest-client/actions/workflows/continuous-integrations.yaml/badge.svg?branch=main)](https://github.com/pgEdge/prest-client/actions/workflows/continuous-integrations.yaml)
[![License](https://badgen.net/github/license/pgEdge/prest-client)](./LICENSE)
[![Package tree-shaking](https://badgen.net/bundlephobia/tree-shaking/prest-client)](https://bundlephobia.com/package/prest-client)
[![Package minified & gzipped size](https://badgen.net/bundlephobia/minzip/prest-client)](https://bundlephobia.com/package/prest-client)
[![Package dependency count](https://badgen.net/bundlephobia/dependency-count/reactprest-client)](https://bundlephobia.com/package/prest-client)

`prest-client` is a TypeScript/JavaScript library that provides a convenient interface for interacting with the [pRESTd](https://docs.prestd.com/) API. It allows you to perform various operations on your PostgreSQL database, including CRUD operations, filtering, joining tables, advanced queries and so on.

## Features

- **CRUD Operations**: Create, read, update, and delete data from your PostgreSQL database.
- **Filtering**: Apply various filters to your queries, such as `page`, `pageSize`, `select`, `filterEqual`, and more.
- **Function Operations**: Perform aggregate functions like `sum`, `avg`, `max`, `min`, `stdDev`, and `variance`.
- **Advanced Queries**: Utilize advanced query capabilities like `filterRange`, `join`, `textSearch`, and more.
- **Batch Operations**: Insert multiple rows into a table with a single operation.
- **TypeScript Support**: Written in TypeScript, providing type safety and better tooling support.

## Installation

This library is published in the NPM registry and can be installed using any compatible package manager.

```sh
npm install prest-client --save

# For Yarn, use the command below.
yarn add prest-client
```

### Installation from CDN

This module has an UMD bundle available through JSDelivr and Unpkg CDNs.

```html
<!-- For UNPKG use the code below. -->
<script src="https://unpkg.com/prest-client"></script>

<!-- For JSDelivr use the code below. -->
<script src="https://cdn.jsdelivr.net/npm/prest-client"></script>

<script>
  // UMD module is exposed through the "prestClient" global variable.
  console.log(prestClient);
</script>
```

## Usage

Here's a basic example of how to use prest-client:

```typescript
import { PrestApiClient, type PrestApiClientOptions } from 'prest-client';

const options: PrestApiClientOptions = {
  base_url: envs.BASE_URL,
  user_name: envs.USER_NAME,
  password: envs.USER_PASSWORD,
  database: envs.DATABASE_NAME,
};
const client = new PrestApiClient(options);

// Fetch users
const fetchUsers = async () => {
  const response = await client.table('users').list().execute();
  console.log(response);
};

// Insert data
const insertData = async () => {
  const data = {
    user_id: 1,
    user_name: 'john doe',
  };

  const response = await client.table('users').insert(data).execute();
  console.log(response);
};
```

For more examples, please refer to the [examples](https://github.com/pgEdge/prest-client/tree/examples) directory in the repository.

## Documentation

[Documentation generated from source files by Typedoc](./docs/README.md).

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

Released under [MIT License](./LICENSE).
