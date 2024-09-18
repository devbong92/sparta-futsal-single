import express from 'express';
import GamesController from '../controllers/games.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
const gamesController = new GamesController();

/** 캐시 충전 API */
router.post('/games/play', authMiddleware, gamesController.playGame);

export default router;
