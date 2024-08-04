import { Request, Response } from "express";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { fetchPosts } from "../utills/postUtils";
import { Op } from "sequelize";

// 전체 게시글 조회(비공개는 제외)
export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = 6; // 6개씩 가져오기
    const options = {
      where: { showStatus: true },
    };
    const result = await fetchPosts(options, page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "게시글 조회에 실패하였습니다." });
  }
};

// 특정 유저 게시글 조회
export const getUserPost = async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const targetUserId = parseInt(req.params.userId, 10) || 1;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = 6; // 6개씩 가져오기
    const options: { where: { userId: number; showStatus?: boolean } } = {
      where: { userId: targetUserId },
    };
    if (userId !== targetUserId) {
      options.where.showStatus = true;
    }
    const result = await fetchPosts(options, page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "유저 게시글 조회에 실패하였습니다." });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const defaultPostImg = "https://cdn-icons-png.flaticon.com/512/3875/3875148.png";
    const userId = req.session.userId; // 세션에서 가져오는 정보
    // request body에서 받는 정보 5가지
    const { thumb, title, description, content, showStatus } = req.body;
    const newPost = await Post.create({
      userId,
      thumb: thumb || defaultPostImg,
      title,
      description: description || content.substring(0, 150), // 입력이 없다면 본문에서 150자 가져오기
      content,
      showStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json({ message: "게시글 생성 완료" });
  } catch (error) {
    res.status(500).json({ error: "게시글 생성에 실패하였습니다." });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "userName"],
        },
      ],
    });
    if (post) {
      res.status(200).json({
        id: post.id,
        userId: post.user ? post.user.id : null,
        author: post.user ? post.user.userName : "Unknown",
        thumb: post.thumb,
        title: post.title,
        description: post.description,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        showStatus: post.showStatus,
        likeCount: post.likeCount,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "게시글 조회에 실패하였습니다." });
  }
};

export const updatePostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const { thumb, title, description, content, showStatus } = req.body;

    // 세션에서 userId 가져오기
    const userId = req.session.userId;
    const post = await Post.findOne({
      where: { id: postId },
    });

    if (post && post.userId !== userId) {
      return res.status(403).json({ error: "권한이 없습니다." });
    }

    if (post) {
      post.thumb = thumb || post.thumb;
      post.title = title || post.title;
      post.description = description || post.description;
      post.content = content || post.content;
      post.showStatus = showStatus !== undefined ? showStatus : post.showStatus;
      post.updatedAt = new Date();

      await post.save(); // 저장
      res.status(200).json(post);
    }
  } catch (error) {
    res.status(500).json({ error: "게시글 수정에 실패하였습니다." });
  }
};

export const deletePostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.session.userId;

    const post = await Post.findOne({
      where: { id: postId },
    });

    if (post && post.userId !== userId) {
      return res.status(403).json({ error: "글을 삭제할 수 있는 권한이 없습니다." });
    }
    if (post) {
      await post.destroy();
      res.status(200).json({ message: "게시글 삭제 완료." });
    }
  } catch (error) {
    return res.status(500).json({ error: "게시글 삭제에 실패하였습니다." });
  }
};

export const searchPostByKeyword = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword as string;
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = 6; // 페이지당 아이템 수
    const offset = (page - 1) * pageSize;

    if (!keyword) {
      return res.status(400).json({ error: "검색어를 입력해주세요." });
    }

    const { count, rows } = await Post.findAndCountAll({
      where: {
        [Op.or]: [{ title: { [Op.like]: `%${keyword}%` } }, { content: { [Op.like]: `%${keyword}%` } }],
        showStatus: true, // 공개된 게시글만 검색
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "userName"],
        },
      ],
      limit: pageSize,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / pageSize);

    const posts = rows.map((post) => ({
      id: post.id,
      author: post.user ? post.user.userName : "Unknown",
      thumb: post.thumb,
      title: post.title,
      description: post.description,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      showStatus: post.showStatus,
      likeCount: post.likeCount,
    }));

    res.status(200).json({
      posts,
      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages,
        pageSize,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "게시글 검색에 실패하였습니다." });
  }
};
