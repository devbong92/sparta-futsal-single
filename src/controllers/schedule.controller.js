import ScheduleService from '../services/schedule.service.js';
import asyncHandler from 'express-async-handler';
import { logger } from '../../config/winston.config.js';
import schedule from 'node-schedule';

export default class ScheduleController {
  constructor() {
    this.scheduleService = new ScheduleService();
  }

  createRankHistory = asyncHandler(async () => {
    logger.info(' ScheduleController() START ');
    /* 
    + cron 형식 - UTC 
    second(0-59)
    minute(0-59)
    hour(0-23)
    day(1-31)
    month(1-12)
    day of week(0-7)
  */

    // 매일 01시 반복
    schedule.scheduleJob('0 0 1 * * *', async () => {
      console.log('====>>>> ');
      const result = await this.scheduleService.createRankHistory();
    });

    logger.info(' ScheduleController() END ');
  });
}
