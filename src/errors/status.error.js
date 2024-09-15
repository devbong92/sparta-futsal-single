/**
 * status code를 품은 Error
 */
class StatusError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default StatusError;
