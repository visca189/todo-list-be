"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWebServer = startWebServer;
exports.stopWebServer = stopWebServer;
const express_1 = __importDefault(require("express"));
const express_bootstrap_1 = require("../express-bootstrap");
const configurationProvider = __importStar(require("../express-bootstrap/config-provider"));
const duty_1 = require("./routes/duty");
const db_connection_1 = __importDefault(require("../data-access/db-connection"));
const config_1 = __importDefault(require("../../config"));
const cors_1 = require("../express-bootstrap/middleware/cors");
let connection;
async function startWebServer() {
    configurationProvider.initializeAndValidate(config_1.default);
    express_bootstrap_1.logger.configureLogger({
        level: configurationProvider.getValue('logger.level'),
        prettyPrint: Boolean(configurationProvider.getValue('logger.prettyPrint')),
    }, true);
    const expressApp = (0, express_1.default)();
    defineCommonMiddlewares(expressApp);
    defineRoutes(expressApp);
    defineErrorHandlingMiddleware(expressApp);
    express_bootstrap_1.errorHandler.gracefulShutdown = async () => {
        const dbConnection = (0, db_connection_1.default)();
        if (dbConnection) {
            await dbConnection.end();
        }
    };
    const APIAddress = await openConnection(expressApp);
    return APIAddress;
}
function defineCommonMiddlewares(expressApp) {
    expressApp.use(express_bootstrap_1.addRequestId);
    expressApp.use(express_1.default.urlencoded({ extended: true }));
    expressApp.use(express_1.default.json());
    expressApp.use((0, cors_1.corsSetup)());
}
function defineRoutes(expressApp) {
    expressApp.use('/api/v1/duty', duty_1.dutyRouter);
}
async function openConnection(expressApp) {
    return new Promise((resolve) => {
        const portToListenTo = configurationProvider.getValue('port');
        const webServerPort = portToListenTo || 0;
        express_bootstrap_1.logger.info(`Server is about to listen to port ${webServerPort}`);
        connection = expressApp.listen(webServerPort, () => {
            express_bootstrap_1.errorHandler.listenToErrorEvents(connection);
            resolve(connection.address());
        });
    });
}
async function stopWebServer() {
    return new Promise((resolve) => {
        if (connection !== undefined) {
            connection.close(() => {
                resolve();
            });
        }
    });
}
function defineErrorHandlingMiddleware(expressApp) {
    expressApp.use(async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error, req, res, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next) => {
        if (error && typeof error === 'object') {
            if (error.isCatastrophic === undefined ||
                error.isCatastrophic === null) {
                error.isCatastrophic = true;
            }
        }
        const appError = express_bootstrap_1.errorHandler.handleError(error);
        res.status(appError.HTTPStatus).json({
            status: appError.HTTPStatus,
            name: appError.name,
            message: appError.message,
        });
    });
}
