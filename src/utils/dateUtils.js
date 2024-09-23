export default class DateUtils {
  /**
   * 날짜형식 변환 (YYYY-MM-DD)
   * @param {Date} date
   * @returns
   */
  static getDateStr(date) {
    const today = date;

    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    const dateString = year + '-' + month + '-' + day;

    return dateString;
  }
}
