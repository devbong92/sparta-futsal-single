import jwt from 'jsonwebtoken';
import StatusError from '../errors/status.error.js';
import { StatusCodes } from 'http-status-codes';

/**
 * 인증 관련 유틸
 */
export default class AuthUtils {
  /**
   * JWT 복호화
   * @param {*} req.headers.authorization
   * @returns
   */
  static verify(authorization) {
    if (authorization.split(' ').length < 2) {
      throw new StatusError('잘못된 토큰값 입니다.', StatusCodes.UNAUTHORIZED);
    }
    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      throw new StatusError('토큰 타입이 일치하지 않습니다.', StatusCodes.UNAUTHORIZED);
    }
    try {
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
      return decodedToken.userId;
    } catch (err) {
      console.log('errr =>> ', err);
      if (err.name === 'TokenExpiredError') {
        throw new StatusError('토큰의 유효기간이 지났습니다.', StatusCodes.UNAUTHORIZED);
      }
    }
  }
}
