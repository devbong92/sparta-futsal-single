import joi from 'joi';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import GamesService from '../services/games.service.js';

export default class GamesController {
  constructor() {
    this.gamesService = new GamesService();
  }

  /** 게임 시작 */
  playGame = asyncHandler(async (req, res, next) => {
    const joiSchema = joi.object({
      otherUserId: joi.number().required().messages({
        'number.base': '상대 유저아이디는 숫자타입이어야 합니다.',
        'any.required': '상대 유저아이디를 입력해주세요.',
      }),
    });

    const validation = await joiSchema.validateAsync(req.body);
    const { otherUserId } = validation;
    const { user } = req;

    const result = await this.gamesService.playGame(user.id, otherUserId);

    return res.status(StatusCodes.OK).json({
      message: result.message,
      accessToken: result.accessToken,
    });
  });
}
