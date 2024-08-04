import express, { Request, Response } from 'express';
import { AddressInfo } from 'net';
import { Server } from 'http';
import * as configurationProvider from '../config-provider';
import configurationSchema from '../../config';
import { dutyRouter } from './routes';

let connection: Server;

async function startWebServer(): Promise<AddressInfo> {
  configurationProvider.initializeAndValidate(configurationSchema);
  // logger.configureLogger(
  //   {
  //     prettyPrint: Boolean(
  //       configurationProvider.getValue('logger.prettyPrint')
  //     ),
  //   },
  //   true
  // );
  const expressApp = express();
  defineCommonMiddlewares(expressApp);
  defineRoutes(expressApp);
  defineErrorHandlingMiddleware(expressApp);
  const APIAddress = await openConnection(expressApp);
  return APIAddress;
}

function defineCommonMiddlewares(expressApp: express.Application) {
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(express.json());
}

function defineRoutes(expressApp: express.Application) {
  expressApp.use('/api/v1/duty', dutyRouter);
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

export { startWebServer, stopWebServer };
