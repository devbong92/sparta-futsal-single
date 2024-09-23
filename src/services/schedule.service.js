import { logger } from '../../config/winston.config.js';
import { prisma } from '../utils/prisma/index.js';
import DateUtils from '../utils/dateUtils.js';

export default class ScheduleService {
  /**
   * 랭킹 이력 생성
   */
  async createRankHistory() {
    const result = {};
    logger.info(' createRankHistory() START ');

    const today = new Date();
    const yesterDay = new Date(today.setDate(today.getDate() - 1));
    const yesterDayStr = DateUtils.getDateStr(yesterDay);

    try {
      const res = await prisma.$queryRaw`
    insert into rank_history 
    (
        calc_date, user_id, user_nickname , win_count, draw_count , lose_count ,rating, ranking, ranking_change 
    )
    select
        date_format(now(),'%Y-%m-%d') as calc_date,
        u.id as user_id , u.nickname,
        max(if(s.game_result='승리', s.result_cnt, 0)) as win_cnt,
        max(if(s.game_result='무승부', s.result_cnt, 0)) as draw_cnt,
        max(if(s.game_result='패배', s.result_cnt, 0)) as lose_cnt,
        u.rating,
        dense_rank() over (order by  u.rating desc) as ranking,
        ifnull(  CAST(dense_rank() over (order by  u.rating desc)as SIGNED) - ( select ifnull(ranking,0) from rank_history  where user_id = u.id and calc_date = ${yesterDayStr} ) ,0) as ranking_change
    from (
        select 
            play_user_id, game_result, count(*) as result_cnt
            from game_result_logs grl 
            group by play_user_id, game_result
        ) s
    right outer join users u 
    on s.play_user_id = u.id 
    group by s.play_user_id, u.nickname, u.rating
    order by u.rating desc 
    `;

      console.log('res =>> ', res);
    } catch (err) {
      console.log('err =>> ', err);
    }

    // result.data = JSON.parse(
    //   JSON.stringify(
    //     res,
    //     (key, value) => (typeof value === 'bigint' ? +value.toString() : value), // return everything else unchanged
    //   ),
    // );
    // console.log('result.data ===>> ', result.data);

    logger.info(' createRankHistory() END ');
    return result;
  }
}
