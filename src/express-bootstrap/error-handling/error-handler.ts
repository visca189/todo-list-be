import { logger } from '../logger';
import * as Http from 'http';
import { AppError } from './app-error';

let httpServerRef: Http.Server;

export const errorHandler = {
  // Listen to the global process-level error events
  listenToErrorEvents: (httpServer: Http.Server) => {
    httpServerRef = httpServer;
    process.on('uncaughtException', async (error) => {
      await errorHandler.handleError(error);
    });

    process.on('unhandledRejection', async (reason) => {
      await errorHandler.handleError(reason);
    });

    process.on('SIGTERM', async () => {
      logger.error(
        'App received SIGTERM event, try to gracefully close the server'
      );
      await terminateHttpServerAndExit(errorHandler.gracefulShutdown);
    });

    process.on('SIGINT', async () => {
      logger.error(
        'App received SIGINT event, try to gracefully close the server'
      );
      await terminateHttpServerAndExit(errorHandler.gracefulShutdown);
    });
  },

  handleError: (errorToHandle: unknown): AppError => {
    try {
      const appError: AppError = covertUnknownToAppError(errorToHandle);
      logger.error(appError.message, appError);

      if (appError.isCatastrophic) {
        terminateHttpServerAndExit(errorHandler.gracefulShutdown);
      }
      return appError;
    } catch (handlingError: unknown) {
      // Not using the logger here because it might have failed
      process.stdout.write(
        'The error handler failed, here are the handler failure and then the origin error that it tried to handle'
      );
      process.stdout.write(JSON.stringify(handlingError));
      process.stdout.write(JSON.stringify(errorToHandle));
      return new AppError('unknown error', 'unknown error', 500, true);
    }
  },

  gracefulShutdown: async () => {},
};

const terminateHttpServerAndExit = async (shutdownFn) => {
  if (shutdownFn) {
    await shutdownFn();
  }

  if (httpServerRef) {
    await new Promise<void>((resolve) => {
      httpServerRef.close(() => {
        resolve();
      });
    });
  }

  process.exit();
};

// Responsible to get all sort of crazy error objects including none error objects and
// return the best standard AppError object
export function covertUnknownToAppError(errorToHandle: unknown): AppError {
  if (errorToHandle instanceof AppError) {
    return errorToHandle;
  }

  if (errorToHandle instanceof SyntaxError) {
    return new AppError(errorToHandle.name, errorToHandle.message, 400, false);
  }

  const errorToEnrich: object = getObjectIfNotAlreadyObject(errorToHandle);
  const message = getOneOfTheseProperties(
    errorToEnrich,
    ['message', 'reason', 'description'],
    'Unknown error'
  );
  const name = getOneOfTheseProperties(
    errorToEnrich,
    ['name', 'code'],
    'unknown-error'
  );
  const httpStatus = getOneOfTheseProperties(
    errorToEnrich,
    ['HTTPStatus', 'statusCode', 'status'],
    500
  );
  const isCatastrophic = getOneOfTheseProperties<boolean>(
    errorToEnrich,
    ['isCatastrophic', 'catastrophic'],
    true
  );

  const stackTrace = getOneOfTheseProperties<string | undefined>(
    errorToEnrich,
    ['stack'],
    undefined
  );
  const standardError = new AppError(name, message, httpStatus, isCatastrophic);
  standardError.stack = stackTrace;
  const standardErrorWithOriginProperties = Object.assign(
    standardError,
    errorToEnrich
  );

  return standardErrorWithOriginProperties;
}

const getOneOfTheseProperties = <ReturnType>(
  object: object,
  possibleExistingProperties: string[],
  defaultValue: ReturnType
): ReturnType => {
  // eslint-disable-next-line no-restricted-syntax
  for (const property of possibleExistingProperties) {
    if (property in object) {
      return object[property];
    }
  }
  return defaultValue;
};

function getObjectIfNotAlreadyObject(target: unknown): object {
  if (typeof target === 'object' && target !== null) {
    return target;
  }

  return {};
}
