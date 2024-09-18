import express from 'express';
import TeamsController from '../controllers/teams.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
const teamsController = new TeamsController();

/** 선발 등록 API */
router.post('/teams/starting', authMiddleware, teamsController.addStarting);

/** 선발 해제 API */
router.delete('/teams/starting', authMiddleware, teamsController.subtractStarting);

/** 선발 목록 조회하기 */
router.get('/teams/starting', teamsController.getStating);

/** 보유 선수 목록 조회하기 */
router.get('/teams/players', authMiddleware, teamsController.getPlayers);

export default router;
