import { logger } from './express-bootstrap';
import { AppError, errorHandler } from './express-bootstrap/error-handling';
import { startWebServer } from './api/server';

async function start() {
  return Promise.all([startWebServer()]);
}

start()
  .then((startResponses) => {
    logger.info(
      `The app has started successfully on port: ${startResponses.map(
        (_) => _.port
      )}`
    );
  })
  .catch((error) => {
    errorHandler.handleError(
      new AppError('startup-failure', error.message, 500, true, error)
    );
  });
