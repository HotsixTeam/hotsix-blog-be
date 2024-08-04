import { Model, DataTypes, Association } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./User";
import { Post } from "./Post";

export class Like extends Model {
  public id!: number;
  public postId!: number;
  public userId!: number;
  public user?: User;
  public post?: Post;
  public static associations: {
    user: Association<Like, User>;
    post: Association<Like, Post>;
  };
}

Like.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    postId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "posts",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "likes",
    indexes: [
      {
        unique: true,
        fields: ["userId", "postId"],
      },
    ],
  }
);
