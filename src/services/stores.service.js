import { prisma } from '../utils/prisma/index.js';
import StatusError from '../errors/status.error.js';
import { StatusCodes } from 'http-status-codes';

export default class StoresService {
  /**
   * 캐시 충전
   * @param {Number} userId
   * @param {Number} cash
   */
  async cashCharge(userId, cash) {
    const result = {};

    const user = await prisma.users.findFirst({ where: { id: userId } });

    if (!user) {
      throw new StatusError('잘못된 유저 정보 입니다.', StatusCodes.BAD_REQUEST);
    }

    const updateUser = await prisma.users.update({
      data: {
        cash: user.cash + cash,
      },
      where: {
        id: user.id,
      },
    });

    result.message = `[${updateUser.nickname}] 유저에게 ${cash} 금액이 충전되었습니다. :총 금액 [${updateUser.cash}]`;
    return result;
  }

  /**
   * 선수 뽑기
   * @param {*} userId
   */
  async playerGacha(userId) {
    const result = {};
    const cost = 1000;

    const user = await prisma.users.findFirst({ where: { id: userId } });

    if (!user) {
      throw new StatusError('잘못된 유저 정보 입니다.', StatusCodes.BAD_REQUEST);
    } else if (user.cash < cost) {
      throw new StatusError(
        `${cost} 캐시가 필요합니다. - 보유중인 캐시 : ${user.cash}`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const playerList = await prisma.players.findMany();

    let randomVal = Math.floor(Math.random() * playerList.length);
    const selectedPlayer = playerList[randomVal];

    await prisma.$transaction(async (tx) => {
      await tx.users.update({
        data: {
          cash: user.cash - cost,
        },
        where: { id: userId },
      });

      const userPlayers = await tx.usersPlayers.create({
        data: {
          userId: user.id,
          playerId: selectedPlayer.playerId,
        },
      });
    });

    result.message = `[${selectedPlayer.playerName}] 선수를 뽑았습니다.`;
    return result;
  }
}
