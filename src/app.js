import express from 'express';
import dotenv from 'dotenv';
import errorMiddleware from './middlewares/error.middleware.js';
import teamsRouter from './routes/teams.router.js';
import usersRouter from './routes/users.router.js';
import storesRouter from './routes/stores.router.js';
import gamesRouter from './routes/games.router.js';
import ScheduleController from './controllers/schedule.controller.js';

// .env => process.env
dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json());

app.use('/api', [teamsRouter, usersRouter, storesRouter, gamesRouter]);

// 에러용 미들웨어
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');

  const scheduleController = new ScheduleController();

  scheduleController.createRankHistory();
});
