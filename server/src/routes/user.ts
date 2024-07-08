import { Router } from "express";
import { createUser, getUser, loginUser, logoutUser, checkSession, updateUserName } from "../controllers/user";
import { requestPasswordReset, resetPassword, verifyResetCode } from "../controllers/verify";
const router = Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
// 세션 유효성 확인 라우트 추가
router.get("/check-session", checkSession);
router.get("/:id", getUser);

router.route("/reset").post(requestPasswordReset).patch(resetPassword);
router.route("/reset/verify").post(verifyResetCode);

router.patch("/username", updateUserName);
export default router;
