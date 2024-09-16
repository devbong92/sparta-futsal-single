import express from 'express';
import TeamsController from '../controllers/teams.controller.js';

const router = express.Router();
const teamsController = new TeamsController();

/** 선발 등록 API */
router.post('/teams/starting', teamsController.addStarting);
/** 선발 해제 API */
router.delete('/teams/starting', teamsController.subtractStarting);

export default router;
