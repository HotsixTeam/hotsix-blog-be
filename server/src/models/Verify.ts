import { Model, DataTypes, Association } from "sequelize";
import { sequelize } from "../config/database";

export class Verify extends Model {
  public id!: number;
  public email!: string;
  public verifyToken!: string | null; // 인증 코드
  public verifyExpiry!: Date | null; // 인증 코드 제한시간(10분)
  public attempts!: number; // 인증 코드 전송 시도 횟수(3회)
  public lockUntil!: Date | null; // 인증 코드 전송 후 제한 시간(30분)
  public isVerified!: boolean; // 인증이 완료 여부
}

Verify.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    verifyToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verifyExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lockUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "verifies",
    timestamps: false,
  }
);
