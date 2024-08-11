"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDuty = addDuty;
exports.getDutyById = getDutyById;
exports.getDuties = getDuties;
exports.updateDutyById = updateDutyById;
exports.deleteDutyById = deleteDutyById;
const db_connection_1 = __importDefault(require("../data-access/db-connection"));
async function addDuty(name) {
    const dbConnection = (0, db_connection_1.default)();
    const data = await dbConnection.query(`
    insert into duty (name) values ($1) returning id, name, is_completed
  `, [name]);
    return data.rows?.[0];
}
async function getDutyById(id) {
    const dbConnection = (0, db_connection_1.default)();
    const data = await dbConnection.query(`
    select * from duty where id = $1
  `, [id]);
    return data.rows?.[0];
}
async function getDuties() {
    const dbConnection = (0, db_connection_1.default)();
    const data = await dbConnection.query(`
    select id, name, is_completed from duty
  `);
    return data.rows;
}
async function updateDutyById(id, data) {
    const dbConnection = (0, db_connection_1.default)();
    const resp = await dbConnection.query(`
      update duty
      set name = $1, is_completed = $2
      where id = $3
      returning id, name, is_completed
    `, [data.name, data.is_completed, id]);
    return resp.rows?.[0];
}
async function deleteDutyById(id) {
    const dbConnection = (0, db_connection_1.default)();
    const data = await dbConnection.query(`
    delete from duty where id = $1
  `, [id]);
    if (data.rowCount !== 1) {
        throw new Error(`failed to delete duty with id: ${id}`);
    }
    return data;
}
