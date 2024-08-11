"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = validateData;
const zod_1 = require("zod");
const express_bootstrap_1 = require("../../express-bootstrap");
function validateData(schemas) {
    return (req, res, next) => {
        try {
            for (const key in schemas) {
                const schema = schemas[key];
                schema.parse(req[key]);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                throw new express_bootstrap_1.ValidationError('invalid parameters', errorMessages);
            }
            else {
                throw error;
            }
        }
    };
}
