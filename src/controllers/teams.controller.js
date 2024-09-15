import joi from 'joi';
import asyncHandler from 'express-async-handler';
import TeamsService from '../services/teams.service.js';

export default class TeamsController {
  constructor() {
    this.teamsService = new TeamsService();
  }

  /**
   * 선발 등록
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  addStarting = asyncHandler(async (req, res, next) => {
    const joiSchema = joi.object({
      playerId: joi.number().required().messages({
        'number.base': '플레이어 아이디는 숫자타입이어야 합니다.',
        'any.required': '플레이어 아이디를 입력해주세요.',
      }),
    });

    const validation = await joiSchema.validateAsync(req.body);
    const { playerId } = validation;

    //  test code
    const userId = 1;
    const result = await this.teamsService.addStarting(userId, playerId);

    return res.status(201).json({
      messages: result.messages,
    });
  });

  /**
   * 선발 해제
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  subtractStarting = asyncHandler(async (req, res, next) => {
    const joiSchema = joi.object({
      playerId: joi.number().required().messages({
        'number.base': '플레이어 아이디는 숫자타입이어야 합니다.',
        'any.required': '플레이어 아이디를 입력해주세요.',
      }),
    });

    const validation = await joiSchema.validateAsync(req.body);
    const { playerId } = validation;

    //  test code
    const userId = 1;
    const result = await this.teamsService.subtractStarting(userId, playerId);

    return res.status(201).json({
      messages: result.messages,
    });
  });
}
