"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRequestId = addRequestId;
const context_1 = require("../context");
const node_crypto_1 = require("node:crypto");
const REQUEST_ID_HEADER = 'x-request-id';
function addRequestId(req, res, next) {
    let requestId = req.headers[REQUEST_ID_HEADER];
    if (!requestId) {
        requestId = (0, node_crypto_1.randomUUID)();
        req.headers[REQUEST_ID_HEADER] = requestId;
    }
    res.setHeader(REQUEST_ID_HEADER, requestId);
    const currentContext = (0, context_1.context)().getStore();
    if (currentContext) {
        // Append to the current context
        currentContext.requestId = requestId;
        next();
        return;
    }
    (0, context_1.context)().run({ requestId }, next);
}
