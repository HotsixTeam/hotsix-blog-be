import { Model, DataTypes, Association } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./User";
import { Like } from "./Like";

export class Post extends Model {
  public id!: number;
  public userId!: number;
  public thumb!: string;
  public title!: string;
  public description!: string;
  public content!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public showStatus!: boolean;

  public user?: User;

  public static associations: {
    likes: Association<Post, Like>;
    user: Association<Post, User>;
  };
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    thumb: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    showStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "posts",
    timestamps: true,
  }
);
