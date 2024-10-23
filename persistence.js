"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'postgres', // substitua pelo seu usuário do PostgreSQL
    host: 'localhost',
    database: 'atv_web_2000', // substitua pelo nome do seu banco de dados
    password: 'postgres', // substitua pela sua senha do PostgreSQL
    port: 5432,
});
exports.default = pool;
