import { prisma } from '../utils/prisma/index.js';
import StatusError from '../errors/status.error.js';
import { StatusCodes } from 'http-status-codes';

export default class TeamsService {
  /**
   * 특정 선수를 선발선수로 등록한다.
   *
   * @param {number} userId 유저ID
   * @param {number} userPlayerId 유저-플레이어ID
   * @param {boolean} isStarting 선발여부
   * @returns
   */
  async addStarting(userId, userPlayerId) {
    const result = {};
    const MAX_STARTING_COUNT = 3;

    // 대상 선수 조회
    const targetPlayer = await prisma.usersPlayers.findFirst({
      where: {
        userPlayerId,
        userId,
      },
    });

    if (!targetPlayer) {
      // 대상 선수가 없는 경우,
      throw new StatusError('해당 선수 조회에 실패하였습니다.', StatusCodes.BAD_REQUEST);
    } else if (targetPlayer.isStarting) {
      // 이미 선발인 경우,
      throw new StatusError('이미 선발선수로 등록되어있습니다.', StatusCodes.BAD_REQUEST);
    }

    const startingPlayers = await prisma.usersPlayers.findMany({
      select: { playerId: true },
      where: {
        userId: userId,
        isStarting: true,
      },
    });

    // 기존 선발선수의 수가 ${MAX_STARTING_COUNT}명 이상일 경우 // 3
    if (startingPlayers.length >= MAX_STARTING_COUNT) {
      throw new StatusError(
        `선발선수는 최대 ${MAX_STARTING_COUNT}명까지만 등록 가능합니다.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    // 선발 목록에 같은 선수가 있는 경우,
    const samePlayer = await prisma.usersPlayers.findFirst({
      where: {
        userId: userId,
        isStarting: true,
        playerId: targetPlayer.playerId,
      },
    });
    if (samePlayer) {
      throw new StatusError(`선발목록에 동일한 선수가 포함되어있습니다.`, StatusCodes.BAD_REQUEST);
    }

    // 선발 여부 변경
    const updatePlayer = await prisma.usersPlayers.update({
      data: {
        isStarting: true,
      },
      where: {
        userPlayerId: targetPlayer.userPlayerId,
      },
      select: {
        user: {
          select: { nickname: true },
        },
        player: {
          select: { playerName: true },
        },
      },
    });

    result.message = `[${updatePlayer.user.nickname}]의 [${updatePlayer.player.playerName}] 선수를 선발선수로 등록하였습니다.`;
    return result;
  }

  /**
   * 특정 선수를 선발선수에서 해제한다.
   *
   * @param {*} userId
   * @param {*} playerId
   */
  async subtractStarting(userId, playerId) {
    const result = {};

    // 대상 선수 조회
    const targetPlayer = await prisma.usersPlayers.findFirst({
      where: {
        playerId: playerId,
        userId: userId,
      },
    });

    if (!targetPlayer) {
      // 대상 선수가 없는 경우,
      throw new StatusError('해당 선수 조회에 실패하였습니다.', StatusCodes.BAD_REQUEST);
    } else if (!targetPlayer.isStarting) {
      // 이미 선발이 아닌 경우,
      throw new StatusError('해당 선수는 선발선수가 아닙니다.', StatusCodes.BAD_REQUEST);
    }

    // 선발 여부 변경
    const updatePlayer = await prisma.usersPlayers.update({
      data: {
        isStarting: false,
      },
      where: {
        userPlayerId: targetPlayer.userPlayerId,
      },
      select: {
        user: {
          select: { nickname: true },
        },
        player: {
          select: { playerName: true },
        },
      },
    });

    result.message = `[${updatePlayer.user.nickname}]의 [${updatePlayer.player.playerName}] 선수를 선발에서 해제하였습니다.`;
    return result;
  }
}
