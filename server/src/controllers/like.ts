import { Request, Response } from "express";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { Like } from "../models/Like";
import { sequelize } from "../config/database";

export const addLike = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id, 10);
  const userId = req.session.userId;
  try {
    // 중복 확인
    await sequelize.transaction(async (transaction) => {
      const existingLike = await Like.findOne({
        where: {
          userId,
          postId,
        },
      });

      if (existingLike) {
        return res.status(400).json({ error: "이미 좋아요 추가가 되어 있는 상태입니다." });
      }

      // 좋아요 추가
      await Like.create({ userId, postId }, { transaction });

      // 해당 게시글의 좋아요 수 증가
      const post = await Post.findByPk(postId, { transaction });
      if (post) {
        post.likeCount += 1;
        await post.save({ transaction });
      }
      res.status(201).json({ message: "좋아요 추가가 완료 되었습니다." });
    });
  } catch (error) {
    res.status(500).json({ error: "좋아요 추가에 실패하였습니다." });
  }
};

export const removeLike = async (req: Request, res: Response) => {
  const userId = req.session.userId; // 세션에서 사용자 ID 가져오기
  const postId = parseInt(req.params.id, 10);

  try {
    await sequelize.transaction(async (transaction) => {
      // 좋아요가 있는지 확인
      const like = await Like.destroy({
        where: { postId: Number(postId), userId },
        transaction,
      });

      if (like) {
        const post = await Post.findByPk(postId, { transaction });
        if (post) {
          post.likeCount = Math.max(post.likeCount - 1, 0);
          await post.save({ transaction });
          res.status(200).json({ message: "좋아요 취소가 완료 되었습니다." });
        }
      } else {
        res.status(404).json({ error: "좋아요 추가가 되어 있지 않은 상태입니다." });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "좋아요 취소에 실패하였습니다." });
  }
};

export const getLike = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id, 10);
  try {
    // 해당 포스트의 좋아요 수 조회
    const likes = await Like.findAll({
      where: { postId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id"],
        },
      ],
    });
    const userIds = likes.map((like) => like.userId);
    res.status(200).json({
      likeCount: likes.length,
      likedId: userIds,
    });
    // 해당 포스트 아이디를 가지고 있는 모든 userId(프라이머리 키) 반환
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "좋아요 조회에 실패하였습니다." });
  }
};
