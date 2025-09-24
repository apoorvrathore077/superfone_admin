import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,   // <-- corrected
  port: Number(process.env.DB_PORT) || 5432,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false } // <-- required for Supabase
});

pool.on('connect', () => console.log('Database connected ✅'));
pool.on('error', err => {
  console.error('Unexpected DB error', err);
  process.exit(-1);
});

export default pool;
