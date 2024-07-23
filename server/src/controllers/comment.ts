// controllers/comment.ts
import { Request, Response } from "express";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";
import { User } from "../models/User";

// 댓글 작성
export const createComment = async (req: Request, res: Response) => {
  const { content, postId } = req.body;
  const user = req.user;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "게시물을 찾을 수 없습니다." });
    }

    const comment = await Comment.create({
      content,
      userId: user.id,
      postId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "댓글 작성에 실패하였습니다." });
  }
};

// 댓글 조회 (단일 댓글)
export const getComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findByPk(id);
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: "댓글 조회에 실패하였습니다." });
  }
};

// 게시물의 모든 댓글 조회
export const getCommentsByPost = async (req: Request, res: Response) => {
  const postId = req.params.id;

  try {
    const comments = await Comment.findAll({
      where: { postId },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["userName", "profileImg"],
        },
      ],
    });
    const result = await Promise.all(
      comments.map(async (comment) => {
        const user = await comment.getUser();
        return {
          id: comment.id,
          content: comment.content,
          updatedAt: comment.updatedAt,
          userId: comment.userId,
          postId: comment.postId,
          userName: user ? user.userName : "Unknown",
          profileImg: user ? user.profileImg : null,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "댓글 조회에 실패하였습니다." });
  }
};

// 댓글 수정
export const updateComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const user = req.user;

  try {
    const comment = await Comment.findByPk(id);
    if (comment) {
      if (comment.userId !== user.id) {
        return res.status(403).json({ error: "댓글을 수정할 권한이 없습니다." });
      }

      comment.content = content;
      comment.updatedAt = new Date();
      await comment.save();

      res.status(200).json(comment);
    }
  } catch (error) {
    res.status(500).json({ error: "댓글 수정에 실패하였습니다." });
  }
};

// 댓글 삭제
export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const comment = await Comment.findByPk(id);
    if (comment) {
      if (comment.userId !== user.id) {
        return res.status(403).json({ error: "댓글을 삭제할 권한이 없습니다." });
      }

      await comment.destroy();
    }

    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ error: "댓글 삭제에 실패하였습니다." });
  }
};
