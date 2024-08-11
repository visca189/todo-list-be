"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isCI = require('is-ci');
const dockerCompose = require('docker-compose');
exports.default = async () => {
    if (isCI) {
        dockerCompose.down();
    }
};
