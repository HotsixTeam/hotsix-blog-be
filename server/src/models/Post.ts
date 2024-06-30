import { Model, DataTypes, Association } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

// 여기서 Model이 의미하는 바는 
// 'sequelize' 라이브러리에서 테이블을 객체로서 표현하기 위해 사용하는 클래스

// Table posts {
//     id integer [pk, increment] // Primary Key, Auto Increment
//     userId integer [ref: > users.userId, not null] // Foreign Key
//     thumb varchar(300)
//     title varchar(100) [not null]
//     description varchar(150)
//     content longtext [not null]
//     createdAt timestamp [not null]
//     updatedAt timestamp
//     showStatus boolean
// }

export class Post extends Model {
    public id!: number; 
    public userId!: number; // 유저 id (pk)
    public thumb!: string;
    public title!: string;
    public description!: string;
    public content!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
    public showStatus!: boolean;

    // User 모델과의 연관성을 나타내는 속성을 추가.
    public user?: User;

    public static associations: {
        user: Association<Post, User>;
    };    
}

Post.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
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
        type: DataTypes.TEXT('long'),
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
    },
    showStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    sequelize, // 시퀄라이즈 인스턴스
    tableName: 'posts', // 데이터베이스 테이블 이름
    timestamps: true, // createdAt과 updatedAt 컬럼을 자동으로 추가
});

Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });