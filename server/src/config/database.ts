import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
export const sequelize = new Sequelize(process.env.DB_DATABASE!, process.env.DB_USERNAME!, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!, 10),
  timezone: "+09:00", // KST (UTC+9)
  dialect: "mariadb",
  logging: false,
});
