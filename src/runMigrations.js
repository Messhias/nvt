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
exports.runMigrations = void 0;
const connection_1 = require("./database/connection");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const runMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, connection_1.connectDB)();
    const migrationsPath = path_1.default.join(__dirname, 'migrations', 'initial_migration.sql');
    const migrations = fs_1.default.readFileSync(migrationsPath, 'utf8');
    yield db.exec(migrations);
    console.log('Migrations applied successfully');
});
exports.runMigrations = runMigrations;
