import { PrestApiClient } from 'prest-client';
import { options } from './basic-crud';

const client = new PrestApiClient(options);

// Page filter
const pageFilter = async () => {
  const response = await client.table('categories').list().page(1).execute();
  console.log(response);
};

// PageSize filter
const pageSizeFilter = async () => {
  const response = await client
    .table('categories')
    .list()
    .pageSize(30)
    .execute();
  console.log(response);
};

// Select filter
const selectFilter = async () => {
  const response = await client
    .table('categories')
    .list()
    .select('category_id', 'category_name')
    .execute();
  console.log(response);
};

// FilterEqual filter
const filterEqualFilter = async () => {
  const response = await client
    .table('categories')
    .list()
    .filterEqual('category_name', 'Footballer')
    .execute();
  console.log(response);
};

(async () => {
  await pageFilter();
  await pageSizeFilter();
  await selectFilter();
  await filterEqualFilter();
})();
