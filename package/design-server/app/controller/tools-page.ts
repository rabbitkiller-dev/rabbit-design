import { Controller } from 'egg';
import {EntityManager} from 'typeorm';
import {Result} from '../lib/web/result';

export default class ToolsPageController extends Controller {
  public async index() {
    await this.app.typeorm.transaction(async (entityManager: EntityManager) => {
      this.ctx.body = new Result(await this.ctx.service.toolsPage.queryToolsPageTree(entityManager));
    });
  }
}
