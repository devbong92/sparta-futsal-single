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
      userPlayerId: joi.number().required().messages({
        'number.base': '플레이어 아이디는 숫자타입이어야 합니다.',
        'any.required': '플레이어 아이디를 입력해주세요.',
      }),
    });

    const validation = await joiSchema.validateAsync(req.body);
    const { userPlayerId } = validation;
    const { user } = req;

    const result = await this.teamsService.addStarting(user.id, userPlayerId);

    return res.status(201).json({
      message: result.message,
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
      userPlayerId: joi.number().required().messages({
        'number.base': '플레이어 아이디는 숫자타입이어야 합니다.',
        'any.required': '플레이어 아이디를 입력해주세요.',
      }),
    });

    const validation = await joiSchema.validateAsync(req.body);
    const { userPlayerId } = validation;
    const { user } = req;

    const result = await this.teamsService.subtractStarting(user.id, userPlayerId);

    return res.status(201).json({
      message: result.message,
    });
  });

  /**
   * 선발 목록 조회
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  getStating = asyncHandler(async (req, res, next) => {
    const joiSchema = joi.object({
      userId: joi.number().required().messages({
        'number.base': '유저 아이디는 숫자타입이어야 합니다.',
        'any.required': '유저 아이디를 입력해주세요.',
      }),
    });

    const validation = await joiSchema.validateAsync(req.body);
    const { userId } = validation;

    const result = await this.teamsService.getStating(userId);

    return res.status(201).json({
      data: result.data,
    });
  });

  /**
   * 보유 선수 목록 조회
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  getPlayers = asyncHandler(async (req, res, next) => {
    const { user } = req;
    const result = await this.teamsService.getPlayers(user.id);

    return res.status(201).json({
      data: result.data,
    });
  });
}
