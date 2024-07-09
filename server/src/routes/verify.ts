import { Router } from "express";
import { requestEmailVerify, resetPassword, verifyCode } from "../controllers/verify";
const router = Router();

router.route("/request").post(requestEmailVerify);
router.route("/code").post(verifyCode);
router.route("/reset").patch(resetPassword);

export default router;
