import { Post } from "../models/Post";
import { User } from "../models/User";
import { Like } from "../models/Like";
import { Comment } from "../models/Comment";
import { Sequelize } from "sequelize";

// 게시글 조회 로직
export const fetchPosts = async (options: any, page: number, limit: number) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await Post.findAndCountAll({
    ...options,
    limit,
    offset,
    order: [["createdAt", "DESC"]], // 최신 순 정렬
    include: [
      {
        model: User,
        as: "user",
        attributes: ["userName"],
      },
    ],
  });

  const totalPages = Math.ceil(count / limit);

  // 게시글 ID 목록
  const postIds = rows.map((post) => post.id);

  // 좋아요 수 조회
  const likeCounts = await Like.findAll({
    attributes: ["postId", [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]],
    where: { postId: postIds },
    group: ["postId"],
  });

  // 댓글 수 조회
  const commentCounts = await Comment.findAll({
    attributes: ["postId", [Sequelize.fn("COUNT", Sequelize.col("id")), "count"]],
    where: { postId: postIds },
    group: ["postId"],
  });

  // 좋아요 수와 댓글 수를 Map으로 변환
  const likeCountMap = new Map(likeCounts.map((like) => [like.get("postId"), like.get("count")]));
  const commentCountMap = new Map(commentCounts.map((comment) => [comment.get("postId"), comment.get("count")]));

  return {
    posts: rows.map((post) => ({
      id: post.id,
      author: post.user ? post.user.userName : "Unknown",
      thumb: post.thumb,
      title: post.title,
      description: post.description,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      showStatus: post.showStatus,
      likeCount: likeCountMap.get(post.id) || 0,
      commentCount: commentCountMap.get(post.id) || 0,
    })),
    pagination: {
      totalItems: count,
      currentPage: page,
      totalPages: totalPages,
      pageSize: limit,
    },
  };
};
