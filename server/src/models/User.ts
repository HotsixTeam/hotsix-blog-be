import { Model, DataTypes, Association } from 'sequelize';
import { sequelize } from '../config/database';
import { Post } from './Post';
import { Like } from './Like';

export class User extends Model {
    public id!: number;
    public userId!: string;
    public password!: string;
    public userName!: string;
    public createdAt!: Date;
    public profileImg!: string | null;
    public gitUrl!: string | null;
    public introduce!: string | null;

    public static associations: {
        posts: Association<User, Post>;
        likes: Association<User, Like>;
    };
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
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    profileImg: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    gitUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    introduce: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'users',
    timestamps: false,
});