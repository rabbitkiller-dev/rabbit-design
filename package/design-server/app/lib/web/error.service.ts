const MESSAGE_JSON = require('./message-cn.json');

export class ErrorService extends Error {
  status: number;
  code: string;

  constructor(message) {
    super(message);
    this.message = message;
  }

  static RuntimeError(code): ErrorService {
    const message = MESSAGE_JSON[code];
    const raError = new ErrorService(message);
    raError.status = 400;
    raError.code = code;
    return raError;
  }

  static RuntimeErrorIdIsNull(): ErrorService {
    const code = 'sys.model.IdIsNull';
    return ErrorService.RuntimeError(code);
  }

  static RuntimeErrorNotFind(): ErrorService {
    const code = 'sys.model.NotFind';
    return ErrorService.RuntimeError(code);
  }

  public setContext(ctx) {
    ctx.status = this.status;
    ctx.body = {
      success: false,
      code: this.code,
      message: this.message,
      stack: this.stack,
    };
    return ctx;
  }

  public setMessage(message) {
    this.message = message;
    return this;
  }

  public setStatus(status) {
    this.status = status;
    return this;
  }
}
