"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const nock_1 = __importDefault(require("nock"));
const server_1 = require("../src/api/server");
const crypto_1 = require("crypto");
let axiosAPIClient;
let defaultUUID = (0, crypto_1.randomUUID)();
beforeAll(async () => {
    const apiConnection = await (0, server_1.startWebServer)();
    const axiosConfig = {
        baseURL: `http://127.0.0.1:${apiConnection.port}/api/v1/duty`,
        validateStatus: () => true,
    };
    axiosAPIClient = axios_1.default.create(axiosConfig);
    nock_1.default.disableNetConnect();
    nock_1.default.enableNetConnect('127.0.0.1');
});
beforeEach(() => {
    nock_1.default.cleanAll();
    (0, nock_1.default)('http://localhost/api/v1/duty').get(`/${defaultUUID}`).reply(200, {
        id: defaultUUID,
        name: 'hello world',
        is_completed: false,
    });
});
afterAll(async () => {
    nock_1.default.enableNetConnect();
    (0, server_1.stopWebServer)();
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
            const aQueryForDeletedOrder = await axiosAPIClient.get(`/${deletedDutyId}`);
            expect(aQueryForDeletedOrder.status).toBe(404);
        });
    });
});
