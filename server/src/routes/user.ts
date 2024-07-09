import { Router } from "express";
import { createUser, getUser, loginUser, logoutUser, checkSession, updateUserName, updateUserInfo } from "../controllers/user";
const router = Router();

router.route("/").post(createUser).get(getUser).patch(updateUserInfo);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
// 세션 유효성 확인 라우트 추가
router.get("/check-session", checkSession);

router.patch("/username", updateUserName);
export default router;
