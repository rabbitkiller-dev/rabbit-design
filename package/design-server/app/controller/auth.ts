import {User} from '../entity';
import {Controller} from '../lib';

export default class AuthController extends Controller {

  /**
   * 认证
   */
  public async auth() {
    const token = this.ctx.session.token;
    if (token) {
      const user = await this.ctx.service.user.findOne(token);
      this.ctx.body = {
        success: true,
        data: user,
      };
    } else {
      this.ctx.body = {
        success: false,
        code: 'sys.notLogin',
        data: {},
      };
    }
  }

  /**
   * 登录
   */
  public async login() {
    this.validate({
      account: {type: 'string'},
      password: {type: 'string'},
    }, this.getParams());
    const user = await this.ctx.service.user.findByAccount(this.getParams().account);
    this.ctx.session.token = user.userID;
    this.ctx.body = {
      success: true,
      data: user,
    };
  }

  public async register() {
    this.validate({
      userName: {type: 'string'},
      password: {type: 'string'},
      email: {type: 'string'},
    }, this.getParams());

    const userRepo = this.app.typeorm.getRepository(User);
    this.ctx.body = {
      success: true,
      data: await userRepo.save({
        userName: this.getParams().userName,
        password: this.getParams().password,
        email: this.getParams().email,
        enable: true,
      }),
    };
  }
}
