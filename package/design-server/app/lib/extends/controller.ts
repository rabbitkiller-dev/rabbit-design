import {Controller as EegController} from 'egg';

export class Controller<E = any> extends EegController {

  getParams(): E {
    if (this.ctx.request.method.toLowerCase() === 'get'.toLowerCase()) {
      return Object.assign({}, this.ctx.params, this.ctx.query);
    } else if (this.ctx.request.method.toLowerCase() === 'post'.toLowerCase()) {
      return Object.assign({}, this.ctx.request.body, this.ctx.query);
    } else if (this.ctx.request.method.toLowerCase() === 'put'.toLowerCase()) {
      return Object.assign({}, this.ctx.request.body, this.ctx.query);
    }
    return {} as any;
  }

  validate(rules: any, data?: any) {
    this.ctx.validate(rules, data);
  }

}
