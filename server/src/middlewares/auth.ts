import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.session;

    if (!userId) {
      return res.status(401).json({ error: "로그인되지 않았습니다." });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    req.user = user; // 요청 객체에 user를 추가
    next();
  } catch (error) {
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
};
