"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dutyRouter = void 0;
const util_1 = __importDefault(require("util"));
const express_1 = __importDefault(require("express"));
const express_bootstrap_1 = require("../../express-bootstrap");
const duty = __importStar(require("../../domain/duty"));
const duty_1 = require("../../error/duty");
const zod_1 = require("zod");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
exports.dutyRouter = router;
const dutyDataSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    is_completed: zod_1.z.boolean(),
});
router.post('/', (0, validation_1.validateData)({ body: dutyDataSchema.pick({ name: true }) }), async (req, res, next) => {
    try {
        express_bootstrap_1.logger.info(`Duty API was called to add new duty ${util_1.default.inspect(req.body)}`);
        const { name } = req.body;
        const result = await duty.addDuty(name);
        return res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        express_bootstrap_1.logger.info(`Duty API was called to get all duty`);
        const result = await duty.getDuties();
        if (!result.length) {
            throw new duty_1.DutyNotFoundError('No duty found');
        }
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', (0, validation_1.validateData)({ params: dutyDataSchema.pick({ id: true }) }), async (req, res, next) => {
    try {
        express_bootstrap_1.logger.info(`Duty API was called to get duty by id ${req.params.id}`);
        const result = await duty.getDutyById(req.params.id);
        if (!result) {
            throw new duty_1.DutyNotFoundError(`Duty with id ${req.params.id} not found`);
        }
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id', (0, validation_1.validateData)({
    params: dutyDataSchema.pick({ id: true }),
    body: dutyDataSchema.omit({ id: true }),
}), async (req, res, next) => {
    try {
        express_bootstrap_1.logger.info(`Duty API was called to update duty by id ${req.params.id}`);
        const { id } = req.params;
        const { name, is_completed } = req.body;
        const result = await duty.updateDutyById(id, { name, is_completed });
        if (!result) {
            res.status(404).end();
            return;
        }
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', (0, validation_1.validateData)({ params: dutyDataSchema.pick({ id: true }) }), async (req, res) => {
    express_bootstrap_1.logger.info(`Duty API was called to delete duty ${req.params.id}`);
    await duty.deleteDutyById(req.params.id);
    res.status(204).end();
});
