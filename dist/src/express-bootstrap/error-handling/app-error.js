"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.BadInputError = exports.AppError = void 0;
class AppError extends Error {
    constructor(name, message, HTTPStatus = 500, isCatastrophic = false, cause) {
        super(message);
        this.name = name;
        this.message = message;
        this.HTTPStatus = HTTPStatus;
        this.isCatastrophic = isCatastrophic;
        this.cause = cause;
    }
}
exports.AppError = AppError;
class BadInputError extends AppError {
    constructor(message, cause) {
        super('BAD_INPUT_ERROR', message, 400, false, cause);
        this.message = message;
        this.cause = cause;
    }
}
exports.BadInputError = BadInputError;
class ValidationError extends AppError {
    constructor(message, cause) {
        super('VALIDATION_ERROR', message, 400, false, cause);
        this.message = message;
        this.cause = cause;
    }
}
exports.ValidationError = ValidationError;
