const isCI = require('is-ci');
const dockerCompose = require('docker-compose');

export default async () => {
  if (isCI) {
    dockerCompose.down();
  }
};
