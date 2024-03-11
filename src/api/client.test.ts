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
    const response = await client.Table('categories').List().execute();
    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
  });

  it('should fetch categories from public schema successfully', async () => {
    const response = await client.Table('public.categories').List().execute();
    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
  });

  it('should retrieve a list of tables in a schema', async () => {
    const response = await client.Table('public.').List().execute();
    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
  });

  it('should fetch information about a table successfully using Show method', async () => {
    const response = await client.Table('categories').Show().execute();
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

    const response = await client.Table('categories').Insert(data).execute();

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
      .Table('categories')
      .Update(dataToUpdate)
      .FilterEqual('category_id', categoryIdToUpdate)
      .execute();

    expect(response).toEqual({ rows_affected: 1 });
  });

  it('should delete data from the table successfully', async () => {
    const categoryIdToDelete = id;

    const response = await client
      .Table('categories')
      .Delete()
      .FilterEqual('category_id', categoryIdToDelete)
      .execute();

    expect(response).toEqual({ rows_affected: 1 });
  });

  // test for filter query methods starts

  it('should apply Page filter correctly', async () => {
    const response = await client.Table('categories').List().Page(2).execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
  });

  it('should apply PageSize filter correctly', async () => {
    const response = await client
      .Table('categories')
      .List()
      .PageSize(30)
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeLessThanOrEqual(30);
  });

  it('should apply Select filter correctly', async () => {
    const response = await client
      .Table('categories')
      .List()
      .Select('category_id', 'category_name')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    expect(response[0]).toHaveProperty('category_id');
    expect(response[0]).toHaveProperty('category_name');
    expect(response[0]).not.toHaveProperty('description');
    expect(response[0]).not.toHaveProperty('picture');
  });

  it('should apply Count filter correctly', async () => {
    const response = await client
      .Table('categories')
      .List()
      .Count('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBe(1);
    expect(response[0]).toHaveProperty('count');
  });

  it('should apply CountFirst filter correctly', async () => {
    const response = await client
      .Table('categories')
      .List()
      .CountFirst()
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBe(28);
    expect(response[0]).toHaveProperty('category_id');
  });

  it('should apply Renderer filter correctly', async () => {
    const jsonResponse = await client
      .Table('categories')
      .List()
      .Renderer('json')
      .execute();

    const xmlResponse = await client
      .Table('categories')
      .List()
      .Renderer('xml')
      .execute();

    console.log(jsonResponse);
    console.log(xmlResponse);
    expect(Array.isArray(jsonResponse)).toBeTruthy();
    expect(typeof xmlResponse).toBe('string');
  });

  it('should apply Distinct filter correctly', async () => {
    const response = await client
      .Table('categories')
      .List()
      .Distinct()
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

  it('should apply Order filter correctly', async () => {
    const ascResponse = await client
      .Table('categories')
      .List()
      .Order('category_id')
      .execute();

    const descResponse = await client
      .Table('categories')
      .List()
      .Order('-category_id')
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

  it('should apply GroupBy filter correctly', async () => {
    const response = await client
      .Table('categories')
      .List()
      .GroupBy('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    const categoryIds = response.map((item: any) => item.category_id);
    const uniqueCategoryIds = new Set(categoryIds);
    expect(categoryIds.length).toBe(uniqueCategoryIds.size);
  });

  it('should apply FilterEqual filter correctly', async () => {
    const response = await client
      .Table('categories')
      .List()
      .FilterEqual('category_name', 'Footballer')
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
  it('should apply Sum function correctly', async () => {
    const response = await client
      .Table('categories')
      .List()
      .GroupBy('category_id')
      .Sum('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('sum');
    });
  });

  it('should apply Avg function correctly', async () => {
    const response = await client
      .Table('categories')
      .List()
      .GroupBy('category_id')
      .Avg('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('avg');
    });
  });

  it('should apply Max function correctly', async () => {
    const response = await client
      .Table('categories')
      .List()
      .GroupBy('category_id')
      .Max('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('max');
    });
  });

  it('should apply Min function correctly', async () => {
    const response = await client
      .Table('categories')
      .List()
      .GroupBy('category_id')
      .Min('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('min');
    });
  });

  it('should apply StdDev function correctly', async () => {
    const response = await client
      .Table('categories')
      .List()
      .GroupBy('category_id')
      .StdDev('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('stddev');
    });
  });

  it('should apply Variance function correctly', async () => {
    const response = await client
      .Table('categories')
      .List()
      .GroupBy('category_id')
      .Variance('category_id')
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item).toHaveProperty('variance');
    });
  });

  it('should apply Having filter correctly', async () => {
    const response = await client
      .Table('categories')
      .List()
      .GroupBy('category_id')
      .Sum('category_id')
      .Having('sum', 'category_id', '$gt', 5)
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
  });
  // tests for function methods ends

  //advanced query methods starts
  it('should apply FilterRange for start value correctly', async () => {
    const start = '200';
    const response = await client
      .Table('categories')
      .List()
      .FilterRange('category_id', start, undefined)
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item.category_id >= start).toBeTruthy();
    });
  });

  it('should apply FilterRange for end value correctly', async () => {
    const end = '300';
    const response = await client
      .Table('categories')
      .List()
      .FilterRange('category_id', undefined, end)
      .execute();

    console.log(response);
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
    response.forEach((item: any) => {
      expect(item.category_id <= end).toBeTruthy();
    });
  });

  it('should apply FilterRange for start and end values correctly', async () => {
    const start = '200';
    const end = '300';
    const response = await client
      .Table('categories')
      .List()
      .FilterRange('category_id', start, end)
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
      .Table('categories')
      .List()
      .Join(
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
      .Table('categories')
      .List()
      .Join(
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
      .Table('categories')
      .List()
      .Join(
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

  it('should apply JSONbFilter correctly with JSONB data in the mock_json table', async () => {
    const newData = {
      tags: 1,
      metadata: {
        created_at: '2023-05-01T10:00:00Z',
        updated_at: '2023-05-01T10:00:00Z',
      },
    };

    const insertedData = await client
      .Table('mock_json')
      .Insert({
        jsonb_data: JSON.stringify(newData),
      })
      .execute();

    const response = await client
      .Table('mock_json')
      .List()
      .JSONbFilter('jsonb_data', 'tags', 1)
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
      .Table('mock_json')
      .Delete()
      .FilterEqual('id', insertedData.id)
      .execute();
  });
});
