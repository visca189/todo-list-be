import express from 'express';
import { AddressInfo } from 'net';
import { Server } from 'http';
import * as configurationProvider from '../config-provider';
import configurationSchema from '../../config';
import { dutyRouter } from './routes/duty';
import { logger } from '../logger';
import { errorHandler } from '../error-handling';
import { addRequestId } from '../middleware/addRequestId';
import getDbConnection from '../data-access/db-connection';
import { LOG_LEVELS } from '../logger/definition';

let connection: Server;

async function startWebServer(): Promise<AddressInfo> {
  configurationProvider.initializeAndValidate(configurationSchema);
  logger.configureLogger(
    {
      level: configurationProvider.getValue('logger.level') as LOG_LEVELS,
      prettyPrint: Boolean(
        configurationProvider.getValue('logger.prettyPrint')
      ),
    },
    true
  );
  const expressApp = express();
  defineCommonMiddlewares(expressApp);
  defineRoutes(expressApp);
  defineErrorHandlingMiddleware(expressApp);

  errorHandler.gracefulShutdown = async () => {
    const dbConnection = getDbConnection();
    if (dbConnection) {
      await dbConnection.end();
    }
  };

  const APIAddress = await openConnection(expressApp);
  return APIAddress;
}

function defineCommonMiddlewares(expressApp: express.Application) {
  expressApp.use(addRequestId);
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());
}

function defineRoutes(expressApp: express.Application) {
  expressApp.use('/api/v1/duty', dutyRouter);
}

async function openConnection(
  expressApp: express.Application
): Promise<AddressInfo> {
  return new Promise((resolve) => {
    const portToListenTo = configurationProvider.getValue('port');
    const webServerPort = portToListenTo || 0;
    logger.info(`Server is about to listen to port ${webServerPort}`);
    connection = expressApp.listen(webServerPort, () => {
      errorHandler.listenToErrorEvents(connection);
      resolve(connection.address() as AddressInfo);
    });
  });
}

async function stopWebServer() {
  return new Promise<void>((resolve) => {
    if (connection !== undefined) {
      connection.close(() => {
        resolve();
      });
    }
  });
}

function defineErrorHandlingMiddleware(expressApp: express.Application) {
  expressApp.use(
    async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: any,
      req: express.Request,
      res: express.Response,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      next: express.NextFunction
    ) => {
      if (error && typeof error === 'object') {
        if (
          error.isCatastrophic === undefined ||
          error.isCatastrophic === null
        ) {
          error.isCatastrophic = true;
        }
      }

      errorHandler.handleError(error);
      res.status(error?.HTTPStatus || 500).json({
        status: error.HTTPStatus || 500,
        name: error.name,
        message: error.message,
      });
    }
  );
}

export { startWebServer, stopWebServer };
