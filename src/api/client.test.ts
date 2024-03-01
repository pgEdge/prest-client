import { PrestApiClient, type PrestApiClientOptions } from './client';

jest.mock('node-fetch');

describe('PrestApiClient', () => {
  let client: PrestApiClient;

  beforeEach(() => {
    const options: PrestApiClientOptions = {
      base_url: '',
      user_name: '',
      password: '',
      database: '',
    };
    client = new PrestApiClient(options);
  });

  it('should fetch categories successfully', async () => {
    const response = await client.Table('categories', 'public').List();
    expect(Array.isArray(response)).toBeTruthy();
    expect(response.length).toBeGreaterThan(0);
  });
});
