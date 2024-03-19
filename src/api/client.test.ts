import { PrestApiClient, type PrestApiClientOptions } from './client';
import envs from '../env.config';

jest.mock('node-fetch');

describe('PrestApiClient', () => {
  let client: PrestApiClient;
  const id: number = Math.floor(Math.random() * 1000);

  beforeEach(() => {
    const options: PrestApiClientOptions = {
      base_url: envs.BASE_URL,
      user_name: envs.USER_NAME,
      password: envs.USER_PASSWORD,
      database: envs.DATABASE_NAME,
    };
    client = new PrestApiClient(options);
  });

  it('should fetch categories successfully', async () => {
    const response = await client.table('categories').list().execute();
    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
  });

  it('should fetch categories from public schema successfully', async () => {
    const response = await client.table('public.categories').list().execute();
    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
  });

  it('should retrieve a list of tables in a schema', async () => {
    const response = await client.table('public.').list().execute();
    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
  });

  it('should fetch information about a table successfully using Show method', async () => {
    const response = await client.table('categories').show().execute();
    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);

    for (const column of response) {
      expect(column).toHaveProperty('position');
      expect(column).toHaveProperty('data_type');
      expect(column).toHaveProperty('max_length');
      expect(column).toHaveProperty('table_name');
      expect(column).toHaveProperty('column_name');
      expect(column).toHaveProperty('is_nullable');
      expect(column).toHaveProperty('is_generated');
      expect(column).toHaveProperty('is_updatable');
      expect(column).toHaveProperty('table_schema');
      expect(column).toHaveProperty('default_value');

      expect(typeof column.position).toBe('number');
      expect(typeof column.data_type).toBe('string');
      expect(typeof column.table_name).toBe('string');
      expect(typeof column.column_name).toBe('string');
      expect(typeof column.is_nullable).toBe('string');
      expect(typeof column.is_generated).toBe('string');
      expect(typeof column.is_updatable).toBe('string');
      expect(typeof column.table_schema).toBe('string');
    }
  });

  it('should insert data into the table successfully', async () => {
    const data = {
      category_id: id,
      category_name: 'Footballer',
      description: 'Siuuu!!!',
      picture: '\\x',
    };

    const response = await client.table('categories').insert(data).execute();

    expect(response).toHaveProperty('category_id');
    expect(typeof response.category_id).toBe('number');
    expect(response).toHaveProperty('category_name');
    expect(response.category_name).toBe(data.category_name);
    expect(response).toHaveProperty('description');
    expect(response.description).toBe(data.description);
  });

  it('should update data in the table successfully', async () => {
    const categoryIdToUpdate = id;
    const dataToUpdate = {
      category_name: 'Footballer',
      description: 'Que mira bobo? Que mira bobo?',
      picture: '\\x',
    };

    const response = await client
      .table('categories')
      .update(dataToUpdate)
      .filterEqual('category_id', categoryIdToUpdate)
      .execute();

    expect(response).toEqual({ rows_affected: 1 });
  });

  it('should delete data from the table successfully', async () => {
    const categoryIdToDelete = id;

    const response = await client
      .table('categories')
      .delete()
      .filterEqual('category_id', categoryIdToDelete)
      .execute();

    expect(response).toEqual({ rows_affected: 1 });
  });

  // test for filter query methods starts

  it('should apply Page filter correctly', async () => {
    const response = await client.table('categories').list().page(2).execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
  });

  it('should apply pageSize filter correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .pageSize(30)
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeLessThanOrEqual(32);
  });

  it('should apply select filter correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .select('category_id', 'category_name')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    expect(response[0]).toHaveProperty('category_id');
    expect(response[0]).toHaveProperty('category_name');
    expect(response[0]).not.toHaveProperty('description');
    expect(response[0]).not.toHaveProperty('picture');
  });

  it('should apply count filter correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .count('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBe(1);
    expect(response[0]).toHaveProperty('count');
  });

  it('should apply countFirst filter correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .countFirst()
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBe(32);
    expect(response[0]).toHaveProperty('category_id');
  });

  it('should apply renderer filter correctly', async () => {
    const jsonResponse = await client
      .table('categories')
      .list()
      .renderer('json')
      .execute();

    const xmlResponse = await client
      .table('categories')
      .list()
      .renderer('xml')
      .execute();

    console.log(jsonResponse);
    console.log(xmlResponse);
    expect(Array.isArray(jsonResponse)).toBeTruthy();
    expect(typeof xmlResponse).toBe('string');
  });

  it('should apply distinct filter correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .distinct()
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    const categoryNames = response.map(
      (item: { category_id: any }) => item.category_id,
    );
    const uniqueCategoryNames = new Set(categoryNames);
    expect(categoryNames.length).toBe(uniqueCategoryNames.size);
  });

  it('should apply order filter correctly', async () => {
    const ascResponse = await client
      .table('categories')
      .list()
      .order('category_id')
      .execute();

    const descResponse = await client
      .table('categories')
      .list()
      .order('-category_id')
      .execute();

    console.log(ascResponse);
    console.log(descResponse);
    expect(Array.isArray(ascResponse)).toBeTruthy();
    expect(Array.isArray(descResponse)).toBeTruthy();
    expect(ascResponse.length).toBeGreaterThan(0);
    expect(descResponse.length).toBeGreaterThan(0);

    const ascIds = Array.from(
      new Set<number>(
        ascResponse.map((item: { category_id: any }) => item.category_id),
      ),
    );
    const descIds = Array.from(
      new Set<number>(
        descResponse.map((item: { category_id: any }) => item.category_id),
      ),
    );

    expect(ascIds).toEqual(ascIds.sort((a, b) => a - b));
    expect(descIds).toEqual(descIds.sort((a, b) => b - a));
  });

  it('should apply groupBy filter correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .groupBy('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    const categoryIds = response.map((item: any) => item.category_id);
    const uniqueCategoryIds = new Set(categoryIds);
    expect(categoryIds.length).toBe(uniqueCategoryIds.size);
  });

  it('should apply filterEqual filter correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .filterEqual('category_name', 'Footballer')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item.category_name).toBe('Footballer');
    });
  });

  // test for filter query methods ends

  // test for function methods starts
  it('should apply sum function correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .groupBy('category_id')
      .sum('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('sum');
    });
  });

  it('should apply avg function correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .groupBy('category_id')
      .avg('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('avg');
    });
  });

  it('should apply max function correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .groupBy('category_id')
      .max('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('max');
    });
  });

  it('should apply min function correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .groupBy('category_id')
      .min('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('min');
    });
  });

  it('should apply stdDev function correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .groupBy('category_id')
      .stdDev('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('stddev');
    });
  });

  it('should apply variance function correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .groupBy('category_id')
      .variance('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('variance');
    });
  });

  it('should apply having filter correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .groupBy('category_id')
      .sum('category_id')
      .having('sum', 'category_id', '$gt', 5)
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
  });
  // tests for function methods ends

  //advanced query methods starts
  it('should apply filterRange for start value correctly', async () => {
    const start = '200';
    const response = await client
      .table('categories')
      .list()
      .filterRange('category_id', start, undefined)
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item.category_id >= start).toBeTruthy();
    });
  });

  it('should apply filterRange for end value correctly', async () => {
    const end = '300';
    const response = await client
      .table('categories')
      .list()
      .filterRange('category_id', undefined, end)
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item.category_id <= end).toBeTruthy();
    });
  });

  it('should apply filterRange for start and end values correctly', async () => {
    const start = '200';
    const end = '300';
    const response = await client
      .table('categories')
      .list()
      .filterRange('category_id', start, end)
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      const itemDate = item.category_id;
      expect(itemDate >= start && itemDate <= end).toBeTruthy();
    });
  });

  it('should perform inner join correctly', async () => {
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
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('category_id');
      expect(item).toHaveProperty('category_name');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('picture');
      expect(item).toHaveProperty('category_id');
    });
  });

  it('should perform left join correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .join(
        'left',
        'products',
        'categories.category_id',
        '$eq',
        'products.category_id',
      )
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('category_id');
      expect(item).toHaveProperty('category_name');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('picture');
    });
  });

  it('should perform right join correctly', async () => {
    const response = await client
      .table('categories')
      .list()
      .join(
        'right',
        'products',
        'categories.category_id',
        '$eq',
        'products.category_id',
      )
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('category_id');
      expect(item).toHaveProperty('category_name');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('picture');
    });
  });

  it('should apply jsonbFilter correctly with JSONB data in the mock_json table', async () => {
    const newData = {
      tags: 1,
      metadata: {
        created_at: '2023-05-01T10:00:00Z',
        updated_at: '2023-05-01T10:00:00Z',
      },
    };

    const insertedData = await client
      .table('mock_json')
      .insert({
        jsonb_data: JSON.stringify(newData),
      })
      .execute();

    const response = await client
      .table('mock_json')
      .list()
      .jsonbFilter('jsonb_data', 'tags', 1)
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);

    const filteredData = response.find(
      (item: any) => item.id === insertedData.id,
    );
    expect(filteredData).toBeDefined();
    expect(filteredData).toHaveProperty('jsonb_data');
    const tags = filteredData.jsonb_data.tags;
    expect(tags).toBe(1);

    await client
      .table('mock_json')
      .delete()
      .filterEqual('id', insertedData.id)
      .execute();
  });

  it('should add a full-text search filter to the query using tsquery syntax', async () => {
    const field = 'description';
    const query = 'Que';

    const response = await client
      .table('categories')
      .list()
      .textSearch(field, query)
      .execute();

    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
  });

  it('should add a full-text search filter to the query including language using tsquery syntax', async () => {
    const field = 'description';
    const query = 'Que';

    const response = await client
      .table('categories')
      .list()
      .textSearch(field, query, 'english')
      .execute();

    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
  });

  it('should insert multiple rows into the table successfully', async () => {
    const data = [
      {
        category_id: id,
        category_name: 'Category 1',
        description: 'Description 1',
        picture: '\\x',
      },
      {
        category_id: id + 1,
        category_name: 'Category 2',
        description: 'Description 2',
        picture: '\\x',
      },
    ];

    const response = await client
      .table('categories')
      .batchInsert(data)
      .execute();

    expect(response).toHaveLength(data.length);
    response.forEach((row: any, index: number) => {
      const testData = data[index];
      expect(row).toHaveProperty('category_id', testData!.category_id);
      expect(row).toHaveProperty('category_name', testData!.category_name);
      expect(row).toHaveProperty('description', testData!.description);
    });

    // batch deletion
    const deleteRes = await client
      .table('categories')
      .delete()
      .filterRange('category_id', id, id + 1)
      .execute();

    console.log(deleteRes);
  });
});
