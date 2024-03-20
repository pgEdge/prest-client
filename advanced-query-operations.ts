import { PrestApiClient } from 'prest-client';
import { options } from './basic-crud';

const client = new PrestApiClient(options);

// FilterRange
const filterRangeOperation = async () => {
  const start = '0';
  const end = '10';
  const response = await client
    .table('categories')
    .list()
    .filterRange('category_id', start, end)
    .execute();
  console.log(response);
};

// Join
const joinOperation = async () => {
  const response = await client
    .table('categories')
    .list()
    .join(
      'inner',
      'products',
      'categories.category_id',
      '$eq',
      'products.category_id',
    )
    .execute();
  console.log(response);
};

// TextSearch
const textSearchOperation = async () => {
  const field = 'description';
  const query = 'Que';

  const response = await client
    .table('categories')
    .list()
    .textSearch(field, query)
    .execute();
  console.log(response);
};

(async () => {
  await filterRangeOperation();
  await joinOperation();
  await textSearchOperation();
})();
