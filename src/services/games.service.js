import { prisma } from '../utils/prisma/index.js';
import StatusError from '../errors/status.error.js';
import { StatusCodes } from 'http-status-codes';

export default class GamesService {
  /**
   * 게임하기
   * @param {Number} playUserId
   * @param {Number} otherUserId
   *
   */
  async playGame(playUserId, otherUserId) {
    const result = {};

    const playUser = await prisma.users.findFirst({ where: { id: playUserId } });
    const otherUser = await prisma.users.findFirst({ where: { id: otherUserId } });

    if (!playUser) {
      throw new StatusError('잘못된 유저 정보 입니다.', StatusCodes.BAD_REQUEST);
    } else if (!otherUser) {
      throw new StatusError('잘못된 상대 유저 정보 입니다.', StatusCodes.BAD_REQUEST);
    }

    /**
     * 게임 플레이 로직
     *
     * 조효영튜터님 말대로..?
     * 1안 ) 90분마다 선수끼리 랜덤 대결 해서 공/수 전환 및 슈팅 대결
     * 2안 ) 위와 비슷하지만 [공] 이라는 객체가 이동하는 식
     */

    result.message = `${playUser.nickname} VS ${otherUser.nickname}`;
    return result;
  }
}
