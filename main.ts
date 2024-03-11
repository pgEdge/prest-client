import { PrestApiClient, PrestApiClientOptions } from "prest-client";

const options: PrestApiClientOptions = {
    base_url: "",
    user_name: "",
    password: "",
    database: "",
};
const client = new PrestApiClient(options);

(async () => {
    // Example 1: Fetch all rows from a table
    const response = await client.Table('categories').List().execute();
    console.table(response);

    // Example 2: Fetch rows with pagination
    const paginatedResponse = await client.Table('categories').List().Page(2).PageSize(10).execute();
    console.table(paginatedResponse);

    // Example 3: Insert a new row
    const newCategory = {
        category_id: 12311,
        category_name: 'New Category',
        description: 'This is a new category',
        picture: '\\x',
    };
    const insertedRow = await client.Table('categories').Insert(newCategory).execute();
    console.log('Inserted row:', insertedRow);

    // Example 4: Update an existing row
    const updatedCategory = {
        description: 'This is a Updated Category',
        picture: '\\x',
    };

    const updatedRow = await client
        .Table('categories')
        .Update(updatedCategory)
        .FilterEqual('category_id', newCategory.category_id)
        .execute();
    console.log('Updated row:', updatedRow);

    // Example 5: Fetch information about a table using Show method
    const tableInfo = await client.Table('categories').Show().execute();
    console.table(tableInfo);

    // Example 6: Apply Select filter
    const selectedColumns = await client
        .Table('categories')
        .List()
        .Select('category_id', 'category_name')
        .execute();
    console.table(selectedColumns);

    // Example 7: Apply Order filter
    const orderedData = await client
        .Table('categories')
        .List()
        .Order('category_id')
        .execute();
    console.table(orderedData);

    // Example 8: Apply FilterEqual filter
    const filteredData = await client
        .Table('categories')
        .List()
        .FilterEqual('category_name', 'Footballer')
        .execute();
    console.table(filteredData);

    // Example 9: Apply Sum function
    const summedData = await client
        .Table('categories')
        .List()
        .GroupBy('category_id')
        .Sum('category_id')
        .execute();
    console.table(summedData);

    // Example 10: Perform inner join
    const joinedData = await client
        .Table('categories')
        .List()
        .Join(
            'inner',
            'products',
            'categories.category_id',
            '$eq',
            'products.category_id'
        )
        .execute();
    console.table(joinedData);

    // Example 11: Delete a row
    const deletedRow = await client
        .Table('categories')
        .Delete()
        .FilterEqual('category_id', newCategory.category_id)
        .execute();
    console.log('Deleted row:', deletedRow);
})();