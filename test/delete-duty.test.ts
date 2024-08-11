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
  describe('DELETE /duty', () => {
    test('When deleting an existing duty, Then it should NOT be retrievable', async () => {
      const dutyToDelete = {
        name: 'delete me',
      };
      const deletedDutyId = (await axiosAPIClient.post('/', dutyToDelete)).data
        .id;

      await axiosAPIClient.delete(`/${deletedDutyId}`);

      const aQueryForDeletedOrder = await axiosAPIClient.get(
        `/${deletedDutyId}`
      );
      expect(aQueryForDeletedOrder.status).toBe(404);
    });
  });
});

export {};
