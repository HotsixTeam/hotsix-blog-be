// server/models/User.ts

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class User extends Model {
    public id!: number;
    public userId!: string;  // Unique, 이메일로 사용
    public password!: string;
    public userName!: string;
    public createdAt!: Date;
    public profileImg!: string | null;
    public gitUrl!: string | null;
    public introduce!: string | null;
}

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    profileImg: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    gitUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    introduce: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'users',
    timestamps: false  // 모델에 'createdAt'과 'updatedAt' 타임스탬프를 자동으로 추가하지 않음
});