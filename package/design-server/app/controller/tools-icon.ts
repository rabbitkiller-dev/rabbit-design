import {Controller} from '../lib';

export default class ToolsIconController extends Controller {
  async fetchIconfont() {
    const scriptUrl = this.getParams().scriptUrl;
    // this.result(await this.service.toolsIcon.generate(await this.service.toolsIcon.fetchIconfont(scriptUrl)));
    this.ctx.body = await this.service.toolsIcon.generate(await this.service.toolsIcon.fetchIconfont(scriptUrl)) as any;
  }
}
