import {Service} from 'egg';
import {Repository} from 'typeorm';

import {User} from '../entity';
import {ErrorService} from '../lib';

/**
 * 用户服务 Service
 */
export default class UserService extends Service {

  public async findOne(id: any): Promise<User> {
    if (!id) {
      throw ErrorService.RuntimeErrorIdIsNull();
    }
    const userRepo: Repository<User> = this.app.typeorm.getRepository(User);
    const user = await userRepo.findOne(id);
    if (!user) {
      throw ErrorService.RuntimeErrorNotFind();
    }
    return user;
  }

  public async findByAccount(account): Promise<User> {
    if (!account) {
      throw ErrorService.RuntimeErrorIdIsNull();
    }
    const userRepo: Repository<User> = this.app.typeorm.getRepository(User);
    const user = await userRepo.findOne({
      email: account,
    });
    if (!user) {
      throw ErrorService.RuntimeErrorNotFind();
    }
    return user;
  }

}
