import { Request, Response } from "express";
import { User } from "../models/User";
import { Verify } from "../models/Verify";
import { sequelize } from "../config/database";

// 이메일 인증 -> 코드 확인 -> 회원가입 가능
export const createUser = async (req: Request, res: Response) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const { userId, password, userName, profileImg, gitUrl, introduce } = req.body;

    const existingUserId = await User.findOne({ where: { userId } });
    if (existingUserId) {
      await transaction.rollback();
      return res.status(400).json({ error: "이미 사용 중인 아이디(이메일)입니다." });
    }
    const verifyInfo = await Verify.findOne({ where: { email: userId } });

    if (!verifyInfo || !verifyInfo.isVerified) {
      await transaction.rollback();
      return res.status(400).json({ error: "가입을 진행할 수 있는 상태가 아닙니다. 아이디(이메일) 인증을 먼저 완료하세요." });
    }
    const existingUserName = await User.findOne({ where: { userName } });
    if (existingUserName) {
      await transaction.rollback();
      return res.status(400).json({ error: "이미 사용 중인 사용자 이름입니다." });
    }

    const defaultProfileImg = "https://cdn-icons-png.flaticon.com/512/1361/1361876.png";
    await User.create(
      {
        userId,
        password,
        userName,
        createdAt: new Date(),
        profileImg: profileImg || defaultProfileImg,
        gitUrl: gitUrl || null,
        introduce: introduce || null,
      },
      { transaction }
    );
    await verifyInfo.destroy({ transaction });
    await transaction.commit();
    res.status(201).json({ message: "회원가입이 성공적으로 이루어졌습니다." });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.log(error);
    res.status(500).json({ error: "회원가입에 실패하였습니다." });
  }
};

export const getUser = (req: Request, res: Response) => {
  const user = req.user;
  const { password, ...userWithoutPassword } = user.toJSON();
  res.status(200).json(userWithoutPassword);
};

// 로그인 함수
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ where: { userId } });

    if (!user) {
      return res.status(401).json({ message: "옳지 않은 아이디 또는 비밀번호 입니다." });
    }

    const isMatch = await user.validPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "옳지 않은 아이디 또는 비밀번호 입니다." });
    }

    req.session.userId = user.id;
    req.session.user = {
      id: user.id,
      userId: user.userId,
      userName: user.userName,
      profileImg: user.profileImg,
      gitUrl: user.gitUrl,
      introduce: user.introduce,
    };

    res.status(200).json({ message: "로그인에 성공하셨습니다.", userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "로그인에 실패하셨습니다." });
  }
};

export const checkSession = (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "세션이 유효하지 않습니다." });
  }
  res.status(200).json({ message: "세션이 유효합니다.", user: req.session.user });
};

// 로그아웃 함수
export const logoutUser = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "로그아웃에 실패하였습니다." });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "로그아웃에 성공하셨습니다." });
  });
};

export const updateUserName = async (req: Request, res: Response) => {
  const { newUserName } = req.body;

  if (!newUserName || typeof newUserName !== "string") {
    return res.status(400).json({ error: "유효하지 않은 사용자 이름입니다." });
  }

  try {
    const existingUser = await User.findOne({ where: { userName: newUserName } });
    if (existingUser) {
      return res.status(400).json({ error: "이미 사용 중인 사용자 이름입니다." });
    }

    const user = req.user;
    user.userName = newUserName;
    await user.save();

    res.status(200).json({ message: "사용자 이름이 성공적으로 변경되었습니다.", userName: user.userName });
  } catch (error) {
    res.status(500).json({ error: "사용자 이름 변경 중 오류가 발생했습니다." });
  }
};

// 로그인 -> 회원정보 변경 -> 로그인 (실패)
export const updateUserInfo = async (req: Request, res: Response) => {
  const { newProfileImg, newGitUrl, newIntroduce } = req.body;

  try {
    const user = req.user;

    if (newProfileImg !== undefined) {
      user.profileImg = newProfileImg;
    }
    if (newGitUrl !== undefined) {
      user.gitUrl = newGitUrl;
    }
    if (newIntroduce !== undefined) {
      user.introduce = newIntroduce;
    }
    await user.save();
    res.status(200).json({
      message: "사용자 정보가 성공적으로 변경되었습니다.",
    });
  } catch (error) {
    res.status(500).json({
      error: "사용자 정보 변경 중 오류가 발생했습니다.",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    await user.destroy();
    res.status(200).json({ message: "사용자 계정 삭제가 완료되었습니다." });
  } catch (error) {
    res.status(500).json({
      error: "사용자 계정 삭제 중 오류가 발생했습니다.",
    });
  }
};
