import express from 'express';
import UsersController from '../controllers/users.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
const usersController = new UsersController();

/** 회원가입 API */
router.post('/users/sign-up', usersController.signUp);

/** 로그인 API */
router.post('/users/sign-in', usersController.signIn);

/** 캐시 충전 API */
router.post('/users/cash/charge', authMiddleware, usersController.cashCharge);

export default router;
