import { Request, Response } from 'express';
import { User } from '../models/User';

export const createUser = async (req: Request, res: Response) => {
    try {
        const {
            userId,
            password,
            userName,
            profileImg,
            gitUrl,
            introduce
        } = req.body;
        
        const existingUserId = await User.findOne({ where: { userId } });
        if(existingUserId) {
            return res.status(400).json({ error: '이미 사용 중인 아이디입니다.' })
        }

        const existingUserName = await User.findOne({ where: { userName } });
        if(existingUserName) {
            return res.status(400).json({ error: '이미 사용 중인 사용자 이름입니다.' })
        }

        const defaultProfileImg = 'https://cdn-icons-png.flaticon.com/512/1361/1361876.png'
        const user = await User.create({
            userId,
            password,
            userName,
            createdAt: new Date(),
            profileImg: profileImg || defaultProfileImg, 
            gitUrl: gitUrl || null, 
            introduce: introduce || null,
        });

        
        res.status(201).json({ message : "회원가입이 성공적으로 이루어졌습니다." });
    } catch (error) {
        res.status(500).json({ error: '안타깝지만 회원가입에 실패하였습니다.' });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: '회원 조회에 실패하였습니다.' });
    }
};

// 로그인 함수
export const loginUser = async (req: Request, res: Response) => {
    try {
    const { userId, password } = req.body;
    const user = await User.findOne({ where: { userId } }); // 찾고

    if (!user || user.password !== password) { // 일치여부 확인 후
        return res.status(401).json({ message: '옳지 않은 아이디 또는 비밀번호 입니다.' });
    }

    // 세션에 사용자 정보 저장
    req.session.userId = user.id;
    req.session.user = {
        id: user.id,
        userId: user.userId,
        userName: user.userName,
        profileImg: user.profileImg,
        gitUrl: user.gitUrl,
        introduce: user.introduce
    };
    console.log("User Logged In: ", user);
    // console.log("Session Data: ", req.session);

    res.status(200).json({ message: '로그인에 성공하셨습니다.', userId: user.id });
    } catch (error) {
    res.status(500).json({ error: '로그인에 실패하셨습니다.' });
    }
};
export const checkSession = async (req: Request, res: Response) => {
    if (!req.session.user) {
        return res.status(401).json({ message: '세션이 유효하지 않습니다.' });
    }

    // 세션에 저장된 사용자 정보로 데이터베이스에서 사용자 조회
    console.log(req.session.user)
    const user = await User.findByPk(req.session.user.id);
    if (!user) {
        return res.status(404).json({ error: '사용자를 찾을 수 없다.' });
    }

    res.status(200).json({ message: '세션이 유효합니다.', user: req.session.user });
};
// 로그아웃 함수
export const logoutUser = async (req: Request, res: Response) => {
    console.log(req.session)
    req.session.destroy((err) => {
    if (err) {
        return res.status(500).json({ error: '로그아웃에 실패하였습니다.' });
    }
    res.clearCookie('connect.sid'); // 'connect.sid'는 세션 쿠키의 이름입니다.
    res.status(200).json({ message: '로그아웃에 성공하셨습니다.' });
    });
};