import {EntityManager} from 'typeorm';
import {Page} from '../entity/page';
import {Controller} from '../lib';
import {Result} from '../lib/web/result';
import {PageInfo} from '../entity/page-info';

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

  public async delete() {
    await this.app.typeorm.transaction(async (entityManager: EntityManager) => {
      await this.ctx.service.toolsPage.deletePage(entityManager, this.getParams().pageID);
      this.result();
    });
  }

  public async findOne() {
    await this.app.typeorm.transaction(async (entityManager: EntityManager) => {
      const page = await this.ctx.service.toolsPage.findOne(entityManager, this.getParams().pageID);
      this.result(page);
    });
  }

  public async pageInfoModify() {
    await this.app.typeorm.transaction(async (entityManager: EntityManager) => {
      const page = await this.ctx.service.toolsPage.pageInfoModify(entityManager, entityManager.getRepository(PageInfo).create(this.getParams()));
      this.result(page);
    });
  }
}
