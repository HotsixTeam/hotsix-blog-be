import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../utills/validation";

import { createUser, getUser, loginUser, logoutUser, checkSession, updateUserName, updateUserInfo, deleteUser } from "../controllers/user";
import { authenticateUser } from "../middlewares/auth";
const router = Router();

router
  .route("/")
  .post(
    [
      body("userId").isEmail().withMessage("유효한 이메일 주소를 입력하세요."),
      body("userName").isLength({ min: 3 }).withMessage("사용자 이름은 최소 3자 이상이어야 합니다."),
      body("password").isLength({ min: 8 }).withMessage("비밀번호는 최소 8자 이상이어야 합니다."),
    ],
    validate,
    createUser
  )
  .get(authenticateUser, getUser) // 현재 로그인된 유저 정보 확인
  .patch(authenticateUser, updateUserInfo) // 현재 로그인된 유저 정보 변경
  .delete(authenticateUser, deleteUser); // 현재 로그인된 유저 계정 삭제
router.post("/login", loginUser);
router.route("/logout").post(authenticateUser, logoutUser); // 현재 로그인된 유저 로그아웃
router.route("/check-session").get(authenticateUser, checkSession);

router.route("/username").patch(authenticateUser, updateUserName); // 현재 로그인된 유저 닉네임 변경
export default router;
