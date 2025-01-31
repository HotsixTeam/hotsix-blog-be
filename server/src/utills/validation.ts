import { param, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { Post } from "../models/Post";
import Comment from "../models/Comment";

// 비밀번호 유효성 검사
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  } else {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ message: errorMessages[0] }); // 첫 번째 에러 메시지만 반환
  }
};
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

// 유저이름(닉네임) 유효성 검사
export const validateUserName = (userName: string): boolean => {
  const userNameRegex = /^[a-zA-Z0-9가-힣_]{3,10}$/;
  return userNameRegex.test(userName);
};

export const validatePostId = [
  param("id").isInt().withMessage("유효한 게시글 ID를 입력하세요."),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postId = req.params.id;
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ error: "해당 게시글을 찾을 수 없습니다." });
      }
      return next();
    } catch (error) {
      return res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
  },
];

export const validateCommentId = [
  param("id").isInt().withMessage("유효한 댓글 ID를 입력하세요."),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const commentId = req.params.id;
      const comment = await Comment.findByPk(commentId);
      if (!comment) {
        return res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
      }
      return next();
    } catch (error) {
      return res.status(500).json({ error: "서버 오류가 발생했습니다." });
    }
  },
];

export const validateSearch = [
  query("keyword").notEmpty().withMessage("검색어를 입력해주세요."),
  query("page").optional().isInt({ min: 1 }).withMessage("유효한 페이지 번호를 입력하세요."),
];
