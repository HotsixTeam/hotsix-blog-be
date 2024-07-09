import { Request, Response } from "express";
import { User } from "../models/User";
import { Verify } from "../models/Verify";
import crypto from "crypto";
import { transporter } from "../config/email";
import bcrypt from "bcrypt";
import { sequelize } from "../config/database";

// 이메일로 비밀번호 재설정 코드를 전송하는 함수
// 코드를 요청하면 시도 횟수 1회 증가, 맞추면 0, 잠금시간이 다된다면 0
// 이메일로 비밀번호 재설정 코드를 전송하는 함수
export const requestEmailVerify = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // const user = await User.findOne({ where: { userId: email } });

    // if (!user) {
    //   return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    // }

    const verifyInfo = await Verify.findOne({ where: { email } });
    console.log(verifyInfo?.attempts);

    if (verifyInfo) {
      // 잠금 상태라면 잠금 해제 시간을 확인
      if (verifyInfo.lockUntil && verifyInfo.lockUntil > new Date()) {
        return res.status(400).json({
          time: verifyInfo.lockUntil,
          error: "이메일 인증 시도가 잠금 상태입니다. 잠시 후 다시 시도하세요.",
        });
      }

      // 잠금 해제 시간이 지났다면 초기화
      if (verifyInfo.lockUntil && verifyInfo.lockUntil <= new Date()) {
        verifyInfo.lockUntil = null;
        verifyInfo.attempts = 0;
      }

      // 시도 횟수가 3회 이상이라면 잠금 설정
      if (verifyInfo.attempts >= 3) {
        verifyInfo.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30분 잠금
        await verifyInfo.save();
        return res.status(400).json({
          time: verifyInfo.lockUntil,
          error: "이메일 인증 시도가 잠금 상태입니다. 잠시 후 다시 시도하세요.",
        });
      }
    }

    const resetCode = crypto.randomBytes(3).toString("hex"); // 6자리 코드 생성
    const resetCodeExpiry = Date.now() + 10 * 60 * 1000; // 10분 유효

    if (verifyInfo) {
      verifyInfo.verifyToken = resetCode;
      verifyInfo.verifyExpiry = new Date(resetCodeExpiry);
      verifyInfo.attempts += 1;
      await verifyInfo.save();
    } else {
      await Verify.create({
        email: email,
        verifyToken: resetCode,
        verifyExpiry: new Date(resetCodeExpiry),
        attempts: 1,
      });
    }

    const mailOptions = {
      to: email,
      from: process.env.EMAIL,
      subject: "이메일 인증 요청",
      text: `이메일 인증을 위해 다음 코드를 입력하세요: ${resetCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "이메일 인증 코드가 발송되었습니다." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "이메일 인증 요청 중 오류가 발생했습니다." });
  }
};
// 코드 검증 후 변경 가능 상태로 변환 함수
export const verifyCode = async (req: Request, res: Response) => {
  const { email, resetCode } = req.body;

  try {
    // const user = await User.findOne({ where: { userId: email } });
    // if (!user) {
    //   return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    // }

    const verifyInfo = await Verify.findOne({ where: { email } });

    if (!verifyInfo || verifyInfo.verifyToken !== resetCode || verifyInfo.verifyExpiry! < new Date()) {
      return res.status(400).json({ error: "유효하지 않은 코드입니다." });
    }

    // 코드가 유효하다면 변경 가능 상태로 변환
    verifyInfo.isVerified = true;
    verifyInfo.attempts = 0;
    await verifyInfo.save();

    res.status(200).json({
      isVerified: verifyInfo.isVerified,
      message: "코드가 유효합니다. 이메일 인증이 완료되었습니다.",
    });
  } catch (error) {
    res.status(500).json({ error: "코드 검증 중 오류가 발생했습니다." });
  }
};

// 비밀번호 변경 함수
export const resetPassword = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({ where: { userId: email }, transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    const verifyInfo = await Verify.findOne({ where: { userId: user.id }, transaction });

    if (!verifyInfo || !verifyInfo.isVerified) {
      await transaction.rollback();
      return res.status(400).json({ error: "비밀번호를 변경할 수 있는 상태가 아닙니다. 이메일 인증을 먼저 완료하세요." });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      await transaction.rollback();
      return res.status(400).json({ error: "새 비밀번호가 현재 비밀번호와 동일합니다." });
    }

    user.password = newPassword;
    await user.save({ transaction });

    // 비밀번호 변경 후 상태 제거
    await verifyInfo.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ message: "비밀번호가 성공적으로 재설정되었습니다." });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    res.status(500).json({ error: "비밀번호 재설정 중 오류가 발생했습니다." });
  }
};
