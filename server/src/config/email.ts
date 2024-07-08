import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// .env 파일 로드
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
  throw new Error('이메일 설정이 올바르지 않습니다.');
}

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});