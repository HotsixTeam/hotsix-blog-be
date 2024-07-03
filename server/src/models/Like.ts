import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Like extends Model {
    public id!: number; 
    public postId!: number;
    public userId!: number;
}

Like.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    postId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'posts',
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
}, {
    sequelize,
    tableName: 'likes',
    indexes: [
        {
            unique: true,
            fields: ['userId', 'postId']
        }
    ]
});