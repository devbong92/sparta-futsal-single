import { StatusCodes } from 'http-status-codes';

/**
 * 에러 핸들러
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export default function (err, req, res, next) {
  console.error('[ERROR *] =>> ', err);

  return res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.statusCode ? err.message : `서버에서 오류가 발생했습니다. ${err.name}`,
  });
}
