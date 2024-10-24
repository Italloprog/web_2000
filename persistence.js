"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'atv_web_2000_6uwm_user', // substitua pelo seu usuário do PostgreSQL
    host: 'dpg-csc569g8fa8c73fpc4t0-a.oregon-postgres.render.com',
    database: 'atv_web_2000_6uwm', // substitua pelo nome do seu banco de dados
    password: '9KWGEsDt3dnDlQcus4PSRZ7LzHRWzc3f', // substitua pela sua senha do PostgreSQL
    port: 5432,
    ssl: { rejectUnauthorized: false }, // Configurando SSL
});
exports.default = pool;
