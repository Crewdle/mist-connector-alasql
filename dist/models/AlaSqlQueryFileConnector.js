"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlaSqlQueryFileConnector = void 0;
const alasql_1 = __importDefault(require("alasql"));
const papaparse_1 = __importDefault(require("papaparse"));
class AlaSqlQueryFileConnector {
    executeQuery(fileContent, query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedContent = papaparse_1.default.parse(fileContent, { header: true });
            const data = [];
            for (const row of parsedContent.data) {
                const newRow = {};
                for (const key in row) {
                    if (!isNaN(Number(row[key]))) {
                        newRow[key] = Number(row[key]);
                    }
                    else {
                        newRow[key] = row[key];
                    }
                }
                data.push(newRow);
            }
            if (data.length === 0) {
                throw new Error('No data found in the file');
            }
            const headers = Object.keys(data[0]);
            const columns = headers.map((header) => `${header} ${typeof data[0][header] === 'string' ? 'STRING' : 'INT'}`);
            (0, alasql_1.default)(`DROP TABLE IF EXISTS file`);
            (0, alasql_1.default)(`CREATE TABLE file (${columns.join(', ')})`);
            alasql_1.default.tables.file.data = data;
            const result = (0, alasql_1.default)(query);
            (0, alasql_1.default)(`DROP TABLE file`);
            return JSON.stringify(result);
        });
    }
}
exports.AlaSqlQueryFileConnector = AlaSqlQueryFileConnector;
