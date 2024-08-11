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
    describe('PUT /duty', () => {
        test('When update a new duty name, should get back updated duty object with 200 response', async () => {
            const dutyToAdd = {
                name: 'update me',
            };
            const receivedAPIResponse = await axiosAPIClient.post('/', dutyToAdd);
            const updateDuty = {
                ...receivedAPIResponse.data,
                name: 'updated',
            };
            const { data, status } = await axiosAPIClient.put(`/${updateDuty.id}`, updateDuty);
            expect({
                data,
                status,
            }).toMatchObject({
                status: 200,
                data: updateDuty,
            });
        });
        test('When update a new duty status, should get back updated duty object with 200 response', async () => {
            const dutyToAdd = {
                name: 'update me',
            };
            const receivedAPIResponse = await axiosAPIClient.post('/', dutyToAdd);
            const updateDuty = {
                ...receivedAPIResponse.data,
                is_completed: true,
            };
            const { data, status } = await axiosAPIClient.put(`/${updateDuty.id}`, updateDuty);
            expect({
                data,
                status,
            }).toMatchObject({
                status: 200,
                data: updateDuty,
            });
        });
        test('When update a new duty status and, should get back updated duty object with 200 response', async () => {
            const dutyToAdd = {
                name: 'update me',
            };
            const receivedAPIResponse = await axiosAPIClient.post('/', dutyToAdd);
            const updateDuty = {
                ...receivedAPIResponse.data,
                name: 'updated',
                is_completed: true,
            };
            const { data, status } = await axiosAPIClient.put(`/${updateDuty.id}`, updateDuty);
            expect({
                data,
                status,
            }).toMatchObject({
                status: 200,
                data: updateDuty,
            });
        });
        test('When updating a duty without name, stop and return 400', async () => {
            const dutyToAdd = {
                name: 'update me',
            };
            const receivedAPIResponse = await axiosAPIClient.post('/', dutyToAdd);
            const updateDuty = {
                id: receivedAPIResponse.data.id,
                is_completed: true,
            };
            const dutyUpdateResult = await axiosAPIClient.put(`/${updateDuty.id}`, updateDuty);
            expect(dutyUpdateResult.status).toBe(400);
            expect(dutyUpdateResult.data).toMatchObject({
                status: 400,
                name: 'VALIDATION_ERROR',
                message: 'invalid parameters',
            });
        });
        test('When updating a duty without is_completed, stop and return 400', async () => {
            const dutyToAdd = {
                name: 'update me',
            };
            const receivedAPIResponse = await axiosAPIClient.post('/', dutyToAdd);
            const updateDuty = {
                id: receivedAPIResponse.data.id,
                name: 'updated',
            };
            const dutyUpdateResult = await axiosAPIClient.put(`/${updateDuty.id}`, updateDuty);
            expect(dutyUpdateResult.status).toBe(400);
            expect(dutyUpdateResult.data).toMatchObject({
                status: 400,
                name: 'VALIDATION_ERROR',
                message: 'invalid parameters',
            });
        });
        test("When data to be updated doesn't exist, return 404", async () => {
            const dutyToUpdate = {
                id: (0, crypto_1.randomUUID)(),
                name: 'incorrect id',
                is_completed: false,
            };
            const dutyAddResult = await axiosAPIClient.put(`/${dutyToUpdate.id}`, dutyToUpdate);
            console.log('dutyAddResult.data', dutyAddResult.data);
            expect(dutyAddResult.status).toBe(404);
        });
    });
});
