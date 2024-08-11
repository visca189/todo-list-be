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
exports.corsSetup = corsSetup;
const cors_1 = __importDefault(require("cors"));
const configurationProvider = __importStar(require("../config-provider"));
const zod_1 = require("zod");
const optionsSchema = zod_1.z.object({
    maxAge: zod_1.z.number(),
    optionsSuccessStatus: zod_1.z.number(),
    origin: zod_1.z.array(zod_1.z.instanceof(RegExp)),
    methods: zod_1.z.string(),
    allowedHeaders: zod_1.z.array(zod_1.z.string()),
    credentials: zod_1.z.boolean().optional(),
});
const defaultOptionSchema = optionsSchema.partial({ origin: true });
function corsSetup() {
    const options = {
        maxAge: 86400,
        optionsSuccessStatus: 204,
        methods: 'GET,PUT,POST,OPTIONS,DELETE',
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    const orginRegex = configurationProvider.getValue('cors.origin');
    if (orginRegex) {
        const regex = typeof orginRegex.regex === 'string'
            ? [orginRegex.regex]
            : orginRegex.regex;
        options.origin = regex.map((_) => new RegExp(_, 'i'));
    }
    optionsSchema.parse(options);
    return (0, cors_1.default)(options);
}
