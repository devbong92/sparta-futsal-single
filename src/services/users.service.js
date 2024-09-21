import { prisma } from '../utils/prisma/index.js';
import StatusError from '../errors/status.error.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class UsersService {
  /**
   * 회원가입
   * @param {string} email 이메일
   * @param {string} password 비밀번호
   * @param {string} nickname 닉네임
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

    console.log('users =>>. ', user.id);

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

  /**
   * 유저 랭킹 조회
   * > userId 값 있으면 해당 유저의 +-${RANK_RANGE} 범위
   * > userId 값 없으면 TOP100
   * @param {number?} userId
   */
  async getRank(userId) {
    const result = {};
    const RANK_RANGE = 5; // 랭킹 범위

    const user = await prisma.users.findFirst({ where: { id: userId } });

    console.log('user---- >>> ', user, userId);

    const res = await prisma.$queryRaw`
    select
            dense_rank() over (order by  u.rating desc) as ranking,
            u.id , u.nickname, u.rating,
            max(if(s.game_result='승리', s.result_cnt, 0)) as win_cnt,
            max(if(s.game_result='무승부', s.result_cnt, 0)) as draw_cnt,
            max(if(s.game_result='패배', s.result_cnt, 0)) as lose_cnt
      from (
             select 
                   play_user_id, game_result, count(*) as result_cnt
              from game_result_logs grl 
          group by play_user_id, game_result
          ) s
      right outer join users u 
                    on s.play_user_id = u.id 
              group by s.play_user_id, u.nickname, u.rating
              order by u.rating desc
    `;
    console.log('res =>>', res);

    const rankArr = await prisma.users.findMany({
      select: {
        id: true,
        nickname: true,
        rating: true,
        _count: {
          select: {
            playUserResultLogs: {
              where: { gameResult: '승리' },
            },
          },
        },
      },
      orderBy: { rating: 'desc' },
    });

    // 이게 맞나...
    result.data = JSON.parse(
      JSON.stringify(
        res,
        (key, value) => (typeof value === 'bigint' ? +value.toString() : value), // return everything else unchanged
      ),
    );

    return result;
  }
}
