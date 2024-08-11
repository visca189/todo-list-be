"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_bootstrap_1 = require("./express-bootstrap");
const error_handling_1 = require("./express-bootstrap/error-handling");
const server_1 = require("./api/server");
async function start() {
    return Promise.all([(0, server_1.startWebServer)()]);
}
start()
    .then((startResponses) => {
    express_bootstrap_1.logger.info(`The app has started successfully on port: ${startResponses.map((_) => _.port)}`);
})
    .catch((error) => {
    error_handling_1.errorHandler.handleError(new error_handling_1.AppError('startup-failure', error.message, 500, true, error));
});
