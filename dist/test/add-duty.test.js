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
    describe('POST /duty', () => {
        test('When adding a new duty by name, should get back duty object with 200 response', async () => {
            const dutyToAdd = {
                name: 'do laundry',
            };
            const receivedAPIResponse = await axiosAPIClient.post('/', dutyToAdd);
            const { data, status } = await axiosAPIClient.get(`/${receivedAPIResponse.data.id}`);
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
