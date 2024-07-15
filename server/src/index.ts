import express from "express";
import { sequelize } from "./config/database";
import userRoutes from "./routes/user";
import postRoutes from "./routes/post";
import verifyRoutes from "./routes/verify";
import commentRoutes from "./routes/comment";
import dotenv from "dotenv";
import session from "express-session";
import "./models/associations";

dotenv.config();

const app = express();
const PORT = 3000; // 환경변수에서 PORT를 가져오거나 기본값으로 3000을 사용

app.use(express.json()); // JSON 요청 본문을 파싱

app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 최대 24시간(하루)
    },
  })
);

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/verifies", verifyRoutes);
app.use("/api/comments", commentRoutes);

sequelize
  .authenticate() // 데이터베이스 연결 확인
  .then(() => {
    console.log("연결. 성공적."); // 성공적으로 연결되면 로그 출력
    return sequelize.sync(); // 모델과 데이터베이스의 스키마를 동기화
  })
  .then(() => {
    app.listen(PORT, () => {
      // 서버 시작
      console.log(`이 서버의 포트는 여기임 http://localhost:${PORT}`); // 서버가 시작되면 포트 정보와 함께 로그 출력
    });
  })
  .catch((err) => {
    console.error("db 접속. 성공적. 이 아님..ㅠ:", err); // 데이터베이스 연결에 실패하면 에러 로그 출력
  });
