// models/Comment.ts
import { Model, DataTypes, Association, BelongsToGetAssociationMixin } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./User";
import { Post } from "./Post";

export class Comment extends Model {
  public id!: number;
  public content!: string;
  public userId!: number;
  public postId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public getUser!: BelongsToGetAssociationMixin<User>;

  public readonly user?: User;

  public static associations: {
    user: Association<Comment, User>;
    post: Association<Comment, Post>;
  };
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER.UNSIGNED,
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
  },
  {
    sequelize,
    tableName: "comments",
    timestamps: true, // 이 옵션을 true로 설정하여 Sequelize가 자동으로 createdAt 및 updatedAt 필드를 관리하게 합니다.
  }
);

export default Comment;
