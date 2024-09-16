import joi from 'joi';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import UsersService from '../services/users.service.js';

export default class UsersController {
  constructor() {
    this.usersService = new UsersService();
  }

  /** 회원가입 */
  signUp = asyncHandler(async (req, res, next) => {
    // 영어 소문자 + 숫자
    const emailRegExp = /^[0-9a-z]*@[0-9a-z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

    const joiSchema = joi.object({
      email: joi.string().regex(emailRegExp).required().messages({
        'string.base': 'Email은 문자열이어야 합니다.',
        'any.required': 'Email을 입력해주세요.',
        'string.pattern.base': 'Email이 형식에 맞지 않습니다.[영어 소문자 + 숫자 조합]',
      }),
      password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required().messages({
        'string.base': '비밀번호는 문자열이어야 합니다.',
        'string.min': `비밀번호의 길이는 최소 {#limit}자 이상입니다.`,
        'any.required': '비밀번호를 입력해주세요.',
      }),
      passwordCheck: joi.any().valid(joi.ref('password')).required().messages({
        'any.only': '비밀번호와 일치해야합니다.',
        'any.required': '비밀번호 확인을 입력해주세요.',
      }),
      nickname: joi.string().min(2).max(10).required().messages({
        'string.base': '이름은 문자열이어야 합니다.',
        'string.min': `이름의 길이는 최소 {#limit}자 이상입니다.`,
        'string.max': `이름의 길이는 최대 {#limit}자 이하입니다.`,
        'any.required': '닉네임을 입력해주세요.',
      }),
    });

    const validation = await joiSchema.validateAsync(req.body);
    const { email, password, nickname } = validation;

    const result = await this.usersService.signUp(email, password, nickname);

    return res.status(StatusCodes.CREATED).json({
      message: result.message,
    });
  });

  /** 로그인 */
  signIn = asyncHandler(async (req, res, next) => {
    // 영어 소문자 + 숫자
    const emailRegExp = /^[0-9a-z]*@[0-9a-z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

    const joiSchema = joi.object({
      email: joi.string().regex(emailRegExp).required().messages({
        'string.base': 'Email은 문자열이어야 합니다.',
        'any.required': 'Email을 입력해주세요.',
        'string.pattern.base': 'Email이 형식에 맞지 않습니다.[영어 소문자 + 숫자 조합]',
      }),
      password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).required().messages({
        'string.base': '비밀번호는 문자열이어야 합니다.',
        'string.min': `비밀번호의 길이는 최소 {#limit}자 이상입니다.`,
        'any.required': '비밀번호를 입력해주세요.',
      }),
    });

    const validation = await joiSchema.validateAsync(req.body);
    const { email, password } = validation;

    const result = await this.usersService.signIn(email, password);

    return res.status(StatusCodes.OK).json({
      message: result.message,
      accessToken: result.accessToken,
    });
  });
}
