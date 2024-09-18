import express from 'express';
import UsersController from '../controllers/users.controller.js';

const router = express.Router();
const usersController = new UsersController();

/** 회원가입 API */
router.post('/users/sign-up', usersController.signUp);

/** 로그인 API */
router.post('/users/sign-in', usersController.signIn);

/** 유저 랭킹 조회  */
router.get('/users/rank', usersController.getRank);

export default router;
