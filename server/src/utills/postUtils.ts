import { Post } from "../models/Post";
import { User } from "../models/User";

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
      likeCount: post.likeCount,
    })),
    pagination: {
      totalItems: count, // 총 게시글
      currentPage: page, // 현재 페이지 번호
      totalPages: totalPages, // 총 페이지 수(6개씩 몇 장)
      pageSize: limit, // 한 페이지 당 게시글 수 (6개)
    },
  };
};
