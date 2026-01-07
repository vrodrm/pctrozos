import { Sequelize } from "sequelize";
import 'dotenv/config';

const { DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_PORT } = process.env;

const db = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT || '3306',
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

export default db;

