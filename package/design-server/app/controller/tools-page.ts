import {EntityManager} from 'typeorm';
import {Page} from '../entity/page';
import {Controller} from '../lib';
import {Result} from '../lib/web/result';

export default class ToolsPageController extends Controller<Page> {
  public async index() {
    await this.app.typeorm.transaction(async (entityManager: EntityManager) => {
      this.ctx.body = new Result(await this.ctx.service.toolsPage.queryToolsPageTree(entityManager, {projectID: this.config.user.projectID}));
    });
  }

  public async add() {
    await this.app.typeorm.transaction(async (entityManager: EntityManager) => {
      this.ctx.body = new Result(await this.ctx.service.toolsPage.savePage(entityManager, entityManager.getRepository(Page).create(this.getParams())));
    });
  }
}
