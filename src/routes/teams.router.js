import express from 'express';
import TeamsController from '../controllers/teams.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
const teamsController = new TeamsController();

/** 선발 등록 API */
router.post('/teams/starting', authMiddleware, teamsController.addStarting);
/** 선발 해제 API */
router.delete('/teams/starting', authMiddleware, teamsController.subtractStarting);

export default router;
