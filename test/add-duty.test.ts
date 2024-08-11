import axios from 'axios';
import nock from 'nock';
import { startWebServer, stopWebServer } from '../src/api/server';
import { randomUUID } from 'crypto';

let axiosAPIClient;
let defaultUUID = randomUUID();

beforeAll(async () => {
  const apiConnection = await startWebServer();
  const axiosConfig = {
    baseURL: `http://127.0.0.1:${apiConnection.port}/api/v1/duty`,
    validateStatus: () => true,
  };
  axiosAPIClient = axios.create(axiosConfig);

  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
});

beforeEach(() => {
  nock.cleanAll();

  nock('http://localhost/api/v1/duty').get(`/${defaultUUID}`).reply(200, {
    id: defaultUUID,
    name: 'hello world',
    is_completed: false,
  });
});

afterAll(async () => {
  nock.enableNetConnect();
  stopWebServer();
});

describe('/api', () => {
  describe('POST /duty', () => {
    test('When adding a new duty by name, should get back duty object with 200 response', async () => {
      const dutyToAdd = {
        name: 'do laundry',
      };

      const receivedAPIResponse = await axiosAPIClient.post('/', dutyToAdd);

      const { data, status } = await axiosAPIClient.get(
        `/${receivedAPIResponse.data.id}`
      );

      expect({
        data,
        status,
      }).toMatchObject({
        status: 200,
        data: {
          ...receivedAPIResponse.data,
        },
      });
    });

    test('When adding a duty without name, stop and return 400', async () => {
      const dutyToAdd = {
        title: 'buy apple',
      };

      const dutyAddResult = await axiosAPIClient.post('/', dutyToAdd);

      expect(dutyAddResult.status).toBe(400);
    });

    test('When a new order failed, a validation error was throw', async () => {
      const dutyToAdd = {
        title: 'buy orange',
      };

      const dutyAddResult = await axiosAPIClient.post('/', dutyToAdd);

      expect(dutyAddResult.data).toMatchObject({
        status: 400,
        name: 'VALIDATION_ERROR',
        message: 'invalid parameters',
      });
    });
  });
});

export {};
