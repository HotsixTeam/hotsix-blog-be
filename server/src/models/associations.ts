import { Post } from "./Post";
import { User } from "./User";
import { Like } from "./Like";
import { Comment } from "./Comment";
// 관계 설정
Post.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });
Post.hasMany(Like, { foreignKey: "postId", as: "likes", onDelete: "CASCADE" });

User.hasMany(Post, { foreignKey: "userId", as: "posts", onDelete: "CASCADE" });
User.hasMany(Like, { foreignKey: "userId", as: "likes", onDelete: "CASCADE" });
User.hasMany(Comment, { as: "comments", foreignKey: "userId", onDelete: "CASCADE" });

Like.belongsTo(Post, { foreignKey: "postId", as: "post", onDelete: "CASCADE" });
Like.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });

Comment.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post", onDelete: "CASCADE" });
