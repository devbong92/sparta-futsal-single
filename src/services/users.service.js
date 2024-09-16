import { prisma } from '../utils/prisma/index.js';
import StatusError from '../errors/status.error.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class UsersService {
  /**
   * 회원가입
   * @param {String} email 이메일
   * @param {String} password 비밀번호
   * @param {String} nickname 닉네임
   */
  async signUp(email, password, nickname) {
    const result = {};
    // 요청 이메일 중복 확인
    const isExistUser = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (isExistUser) {
      throw new StatusError('이미 존재하는 이메일입니다.', StatusCodes.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
      },
    });

    result.message = '회원가입이 완료되었습니다.';

    return result;
  }

  /**
   * 로그인
   * @param {String} email 이메일
   * @param {String} password 비밀번호
   * @returns
   */
  async signIn(email, password) {
    const result = {};

    const user = await prisma.users.findFirst({ where: { email } });

    if (!user) {
      throw new StatusError('잘못된 계정 정보 입니다.', StatusCodes.UNAUTHORIZED);
    } else if (!(await bcrypt.compare(password, user.password))) {
      throw new StatusError('비밀번호가 일치하지 않습니다.', StatusCodes.UNAUTHORIZED);
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: '5m' },
    );

    result.message = '로그인에 성공하였습니다.';
    result.accessToken = accessToken;
    return result;
  }
}
