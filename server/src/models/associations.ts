import { Post } from './Post';
import { User } from './User';
import { Like } from './Like';

// 관계 설정
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });

User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });

Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });