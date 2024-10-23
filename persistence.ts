import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres', // substitua pelo seu usuário do PostgreSQL
  host: 'localhost',
  database: 'atv_web_2000', // substitua pelo nome do seu banco de dados
  password: 'postgres',// substitua pela sua senha do PostgreSQL
  port: 5432,
});

export default pool;