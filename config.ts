export default {
  port: {
    doc: 'The API listening port. Testing will pass 0 (ephemeral) which serves as a dynamic port for testing purposes. For production use, a specific port must be assigned',
    format: 'Number',
    default: 3000,
    nullable: false,
    env: 'PORT',
  },
  DB: {
    connectionUri: {
      doc: 'The DB connection uri',
      format: 'String',
      default: '',
      nullable: false,
      env: 'DB_CONNECTION_URI',
    },
  },
};
