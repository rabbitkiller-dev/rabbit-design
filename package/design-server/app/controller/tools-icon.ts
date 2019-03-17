// import {EntityManager} from 'typeorm';
import {Controller} from '../lib';
// import {Result} from '../lib/web/result';
import {parse} from '../lib/himalaya';

export default class ToolsIconController extends Controller {
  async fetchIconfont() {
    const scriptUrl = this.getParams().scriptUrl;
    const result = await this.ctx.curl(scriptUrl, {dataType: 'text'});
    const scriptContext: string = result.data;
    const svgText = scriptContext.match('\\<svg>.*\\</svg>');
    if (svgText) {
      this.result(parse(svgText.toString()));
    } else {
      this.result([]);
    }
  }
}
