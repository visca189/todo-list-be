"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const is_port_reachable_1 = __importDefault(require("is-port-reachable"));
const path_1 = __importDefault(require("path"));
const docker_compose_1 = __importDefault(require("docker-compose"));
const child_process_1 = require("child_process");
exports.default = async () => {
    console.time('global-setup');
    const isDBReachable = await (0, is_port_reachable_1.default)(54320, { host: 'localhost' });
    if (!isDBReachable) {
        await docker_compose_1.default.upAll({
            cwd: path_1.default.join(__dirname),
            log: true,
        });
        await docker_compose_1.default.exec('database', ['sh', '-c', 'until pg_isready ; do sleep 1; done'], {
            cwd: path_1.default.join(__dirname),
        });
        (0, child_process_1.execSync)('flyway migrate -configFiles=./flyway/flyway.toml -environment=test');
    }
    // 👍🏼 We're ready
    console.timeEnd('global-setup');
};
