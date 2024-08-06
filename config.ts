export default {
  port: {
    doc: 'The API listening port. Testing will pass 0 (ephemeral) which serves as a dynamic port for testing purposes. For production use, a specific port must be assigned',
    format: 'Number',
    default: 3000,
    nullable: false,
    env: 'PORT',
  },
  logger: {
    level: {
      doc: 'Which type of logger entries should actually be written to the target medium (e.g., stdout)',
      format: ['debug', 'info', 'warn', 'error', 'critical'],
      default: 'info',
      nullable: false,
      env: 'LOGGER_LEVEL',
    },
    prettyPrint: {
      doc: 'Whether the logger should be configured to pretty print the output',
      format: 'Boolean',
      default: true,
      nullable: false,
      env: 'PRETTY_PRINT_LOG',
    },
  },
  DB: {
    connectionUri: {
      doc: 'The DB connection uri',
      format: 'String',
      default: 'postgressql://dev:password@localhost:5432/dev',
      nullable: false,
      env: 'DB_CONNECTION_URI',
    },
  },
};
