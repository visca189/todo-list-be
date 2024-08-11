"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DutyNotFoundError = exports.DatabaseError = void 0;
const express_bootstrap_1 = require("../express-bootstrap");
class DatabaseError extends express_bootstrap_1.AppError {
    constructor(message, cause) {
        super('DATABASE_ERROR', message, 500, false, cause);
    }
}
exports.DatabaseError = DatabaseError;
class DutyNotFoundError extends express_bootstrap_1.AppError {
    constructor(message, cause) {
        super('DUTY_NOT_FOUND', message, 404, false, cause);
    }
}
exports.DutyNotFoundError = DutyNotFoundError;
