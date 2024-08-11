"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
exports.covertUnknownToAppError = covertUnknownToAppError;
const logger_1 = require("../logger");
const app_error_1 = require("./app-error");
let httpServerRef;
exports.errorHandler = {
    // Listen to the global process-level error events
    listenToErrorEvents: (httpServer) => {
        httpServerRef = httpServer;
        process.on('uncaughtException', async (error) => {
            await exports.errorHandler.handleError(error);
        });
        process.on('unhandledRejection', async (reason) => {
            await exports.errorHandler.handleError(reason);
        });
        process.on('SIGTERM', async () => {
            logger_1.logger.error('App received SIGTERM event, try to gracefully close the server');
            await terminateHttpServerAndExit(exports.errorHandler.gracefulShutdown);
        });
        process.on('SIGINT', async () => {
            logger_1.logger.error('App received SIGINT event, try to gracefully close the server');
            await terminateHttpServerAndExit(exports.errorHandler.gracefulShutdown);
        });
    },
    handleError: (errorToHandle) => {
        try {
            const appError = covertUnknownToAppError(errorToHandle);
            logger_1.logger.error(appError.message, appError);
            if (appError.isCatastrophic) {
                terminateHttpServerAndExit(exports.errorHandler.gracefulShutdown);
            }
            return appError;
        }
        catch (handlingError) {
            // Not using the logger here because it might have failed
            process.stdout.write('The error handler failed, here are the handler failure and then the origin error that it tried to handle');
            process.stdout.write(JSON.stringify(handlingError));
            process.stdout.write(JSON.stringify(errorToHandle));
            return new app_error_1.AppError('unknown error', 'unknown error', 500, true);
        }
    },
    gracefulShutdown: async () => { },
};
const terminateHttpServerAndExit = async (shutdownFn) => {
    if (shutdownFn) {
        await shutdownFn();
    }
    if (httpServerRef) {
        await new Promise((resolve) => {
            httpServerRef.close(() => {
                resolve();
            });
        });
    }
    process.exit();
};
// Responsible to get all sort of crazy error objects including none error objects and
// return the best standard AppError object
function covertUnknownToAppError(errorToHandle) {
    if (errorToHandle instanceof app_error_1.AppError) {
        return errorToHandle;
    }
    if (errorToHandle instanceof SyntaxError) {
        return new app_error_1.AppError(errorToHandle.name, errorToHandle.message, 400, false);
    }
    const errorToEnrich = getObjectIfNotAlreadyObject(errorToHandle);
    const message = getOneOfTheseProperties(errorToEnrich, ['message', 'reason', 'description'], 'Unknown error');
    const name = getOneOfTheseProperties(errorToEnrich, ['name', 'code'], 'unknown-error');
    const httpStatus = getOneOfTheseProperties(errorToEnrich, ['HTTPStatus', 'statusCode', 'status'], 500);
    const isCatastrophic = getOneOfTheseProperties(errorToEnrich, ['isCatastrophic', 'catastrophic'], true);
    const stackTrace = getOneOfTheseProperties(errorToEnrich, ['stack'], undefined);
    const standardError = new app_error_1.AppError(name, message, httpStatus, isCatastrophic);
    standardError.stack = stackTrace;
    const standardErrorWithOriginProperties = Object.assign(standardError, errorToEnrich);
    return standardErrorWithOriginProperties;
}
const getOneOfTheseProperties = (object, possibleExistingProperties, defaultValue) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const property of possibleExistingProperties) {
        if (property in object) {
            return object[property];
        }
    }
    return defaultValue;
};
function getObjectIfNotAlreadyObject(target) {
    if (typeof target === 'object' && target !== null) {
        return target;
    }
    return {};
}
