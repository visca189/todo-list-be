import { Pool } from 'pg';
import * as configurationProvider from '../express-bootstrap/config-provider';

let dbConnection: Pool;

export default function getDbConnection() {
  if (!dbConnection) {
    dbConnection = new Pool({
      connectionString: configurationProvider.getValue('DB.connectionUri'),
    });
  }

  return dbConnection;
}
