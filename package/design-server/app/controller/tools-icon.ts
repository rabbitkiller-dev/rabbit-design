import {EntityManager} from 'typeorm';
import {Controller} from '../lib';

export default class ToolsIconController extends Controller {
  async index() {
    await this.app.typeorm.transaction(async (entityManager: EntityManager) => {
      this.result(await this.service.toolsIcon.index(entityManager, {projectID: this.config.user.projectID}));
    });
  }

  async fetchIconfont() {
    const scriptUrl: string = this.getParams().scriptUrl;
    await this.app.typeorm.transaction(async (entityManager: EntityManager) => {
      this.result(await this.service.toolsIcon.fetchIconfont(entityManager, {scriptUrl: scriptUrl, projectID: this.config.user.projectID}));
    });
  }

  async getIcon() {
    const namespace: string = this.getParams().namespace;
    const fontClass: string = this.getParams().filename.replace('.svg', '');
    await this.app.typeorm.transaction(async (entityManager: EntityManager) => {
      const icon = await this.service.toolsIcon.getIcon(entityManager, {fontClass: fontClass, namespace: namespace, projectID: this.config.user.projectID});
      this.ctx.body = icon.svgContent;
    });
  }
}
