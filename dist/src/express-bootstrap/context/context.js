"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = context;
const node_async_hooks_1 = require("node:async_hooks");
let currentContext;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function context() {
    if (currentContext === undefined) {
        currentContext = new node_async_hooks_1.AsyncLocalStorage();
    }
    return currentContext;
}
