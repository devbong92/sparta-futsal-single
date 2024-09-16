import express from 'express';
import StoresController from '../controllers/stores.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
const storesController = new StoresController();

/** 캐시 충전 API */
router.post('/stores/cash/charge', authMiddleware, storesController.cashCharge);

/** 선수 뽑기 */
router.post('/stores/players', authMiddleware, storesController.playerGacha);

export default router;
