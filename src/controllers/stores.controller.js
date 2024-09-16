import joi from 'joi';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import StoresService from '../services/stores.service.js';

export default class StoresController {
  constructor() {
    this.storesService = new StoresService();
  }

  /** 캐시 충전 */
  cashCharge = asyncHandler(async (req, res, next) => {
    const joiSchema = joi.object({
      cash: joi.number().required().messages({
        'number.base': '충천 금액은 숫자타입이어야 합니다.',
        'any.required': '충천 금액을 입력해주세요.',
      }),
    });

    const validation = await joiSchema.validateAsync(req.body);
    const { cash } = validation;
    const { user } = req;

    const result = await this.storesService.cashCharge(user.id, cash);

    return res.status(StatusCodes.OK).json({
      message: result.message,
      accessToken: result.accessToken,
    });
  });

  /** 선수 뽑기 */
  playerGacha = asyncHandler(async (req, res, next) => {
    const { user } = req;

    const result = await this.storesService.playerGacha(user.id);

    return res.status(StatusCodes.OK).json({
      message: result.message,
      accessToken: result.accessToken,
    });
  });
}
