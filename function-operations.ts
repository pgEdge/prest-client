import { PrestApiClient } from 'prest-client';
import { options } from './basic-crud';

const client = new PrestApiClient(options);

// Sum function
const sumFunction = async () => {
  const response = await client
    .table('categories')
    .list()
    .groupBy('category_id')
    .sum('category_id')
    .execute();
  console.log(response);
};

// Avg function
const avgFunction = async () => {
  const response = await client
    .table('categories')
    .list()
    .groupBy('category_id')
    .avg('category_id')
    .execute();
  console.log(response);
};

// Max function
const maxFunction = async () => {
  const response = await client
    .table('categories')
    .list()
    .groupBy('category_id')
    .max('category_id')
    .execute();
  console.log(response);
};

(async () => {
  await sumFunction();
  await avgFunction();
  await maxFunction();
})();
