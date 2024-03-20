import { PrestApiClient, type PrestApiClientOptions } from 'prest-client';

export const options: PrestApiClientOptions = {
  base_url: '',
  user_name: '',
  password: '',
  database: '',
};
const client = new PrestApiClient(options);

// Fetch categories
const fetchCategories = async () => {
  const response = await client.table('categories').list().execute();
  console.log(response);
};

// Insert data
const insertData = async () => {
  const data = {
    category_id: 69,
    category_name: 'Cricketer',
    description: 'Gotta run for it!!!',
    picture: '\\x',
  };

  const response = await client.table('categories').insert(data).execute();
  console.log(response);
};

// Update data
const updateData = async () => {
  const categoryIdToUpdate = 69;
  const dataToUpdate = {
    category_name: 'Cricketer',
    description: 'Gotta run for it!!!',
    picture: '\\x',
  };

  const response = await client
    .table('categories')
    .update(dataToUpdate)
    .filterEqual('category_id', categoryIdToUpdate)
    .execute();

  console.log(response);
};

// Delete data
const deleteData = async () => {
  const categoryIdToDelete = 69;

  const response = await client
    .table('categories')
    .delete()
    .filterEqual('category_id', categoryIdToDelete)
    .execute();

  console.log(response);
};

(async () => {
  await fetchCategories();
  await insertData();
  await updateData();
  await deleteData();
})();
