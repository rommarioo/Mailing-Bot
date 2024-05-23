import { Sequelize } from "sequelize";

const sequelize = new Sequelize("test-db", "root", "root", {
  dialect: "sqlite",
  host: "./database.sqlite",
});

export default sequelize;
