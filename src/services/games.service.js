import { prisma } from '../utils/prisma/index.js';
import StatusError from '../errors/status.error.js';
import { StatusCodes } from 'http-status-codes';
import MathUtils from '../utils/mathUtils.js';
import TeamsService from './teams.service.js';

export default class GamesService {
  constructor() {
    this.teamsService = new TeamsService();
  }

  /**
   * 플레이어 능력치 포인트로 환산
   * @param {Array} players 플레이어 객체 배열
   * @returns {number} 종합 포인트
   */
  getPlayersPoint(players) {
    let result = 0;
    for (let i = 0; i < players.length; i++) {
      result += this.getPlayerPoint(players[i].player);
    }
    return result;
  }

  /**
   * 플레이어 능력치 포인트로 환산
   * @param {object} player
   * @returns {number} 종합 포인트
   */
  getPlayerPoint(player) {
    let result = 0;
    /**
        1. 속력 - 0.1
        2. 골 결정력 - 0.25
        3. 슛 파워 - 0.15
        4. 수비 - 0.3
        5. 스태미너 - 0.2
    */
    result +=
      player.speed * 0.1 +
      player.finishing * 0.25 +
      player.shotPower * 0.15 +
      player.defense * 0.3 +
      player.stamina * 0.2;
    return result;
  }

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
    const playerStartings = await this.teamsService.getStating(playUser.id);
    const playerPoint = this.getPlayersPoint(playerStartings.data);

    const otherStartings = await this.teamsService.getStating(otherUser.id);
    const otherPoint = this.getPlayersPoint(otherStartings.data);

    // 최대 점수는 두 팀의 총 점수의 합으로 하시면 됩니다!
    const maxScore = playerPoint + otherPoint;

    const randomValue = Math.random() * maxScore;
    if (randomValue < playerPoint) {
      // A 유저 승리 처리
      const aScore = Math.floor(Math.random() * 4) + 2; // 2에서 5 사이
      const bScore = Math.floor(Math.random() * Math.min(3, aScore)); // aScore보다 작은 값을 설정
      result.message = `${playUser.nickname}의 승리 !! [${playUser.nickname} (${aScore}) : (${bScore}) ${otherUser.nickname}]`;
    } else {
      // B 유저 승리 처리
      const bScore = Math.floor(Math.random() * 4) + 2; // 2에서 5 사이
      const aScore = Math.floor(Math.random() * Math.min(3, bScore)); // bScore보다 작은 값을 설정
      result.message = `${otherUser.nickname}의 승리 !! [${playUser.nickname} (${aScore}) : (${bScore}) ${otherUser.nickname}]`;
    }
    return result;
  }
}
