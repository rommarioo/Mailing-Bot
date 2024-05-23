import { DataTypes, Model } from "sequelize";
import sequelize from "./db.js";
class ModelUser extends Model {}

ModelUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    telegram_id: {
      type: DataTypes.STRING,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
    },
    access_right: {
      type: DataTypes.BOOLEAN,
    },
  },
  { sequelize, modelName: "ModelUser" }
);

export default ModelUser;
