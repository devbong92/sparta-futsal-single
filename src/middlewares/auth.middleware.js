import { prisma } from '../utils/prisma/index.js';
import AuthUtils from '../utils/authUtils.js';
import StatusError from '../errors/status.error.js';
import { StatusCodes } from 'http-status-codes';

/**
 * 인증 핸들러
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export default async function (req, res, next) {
  try {
    if (!req.headers.authorization) {
      throw new StatusError('인증이 필요한 기능입니다.', StatusCodes.UNAUTHORIZED);
    }
    const userId = AuthUtils.verify(req.headers.authorization);
    if (!userId) {
      throw new StatusError('로그인이 필요한 기능입니다.', StatusCodes.UNAUTHORIZED);
    }

    const user = await prisma.users.findFirst({
      where: { id: +userId },
    });
    if (!user) {
      throw new StatusError('사용자가 존재하지 않습니다.', StatusCodes.UNAUTHORIZED);
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}
