import { Request, Response } from "express";
import { Post } from "../models/Post";
import { User } from "../models/User";
import { Like } from "../models/Like";
import { sequelize } from "../config/database";

export const addLike = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id, 10);
  const userId = req.session.userId;
  try {
    await sequelize.transaction(async (transaction) => {
      const existingLike = await Like.findOne({
        where: {
          userId,
          postId,
        },
        transaction,
      });

      if (existingLike) {
        return res.status(400).json({ error: "이미 좋아요 추가가 되어 있는 상태입니다." });
      }

      await Like.create({ userId, postId }, { transaction });
      res.status(201).json({ message: "좋아요 추가가 완료 되었습니다." });
    });
  } catch (error) {
    res.status(500).json({ error: "좋아요 추가에 실패하였습니다." });
  }
};

export const removeLike = async (req: Request, res: Response) => {
  const userId = req.session.userId;
  const postId = parseInt(req.params.id, 10);

  try {
    await sequelize.transaction(async (transaction) => {
      const deleted = await Like.destroy({
        where: { postId: Number(postId), userId },
        transaction,
      });

      if (deleted) {
        res.status(200).json({ message: "좋아요 취소가 완료 되었습니다." });
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
    const userIds = likes.map((like) => like.user?.id).filter((id): id is number => id !== undefined);
    res.status(200).json({
      likeCount: likes.length,
      likedId: userIds,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "좋아요 조회에 실패하였습니다." });
  }
};
