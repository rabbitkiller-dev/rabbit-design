import {Service} from 'egg';
import {EntityManager} from 'typeorm';
import {Icon} from '../entity/icon';
import {ErrorService} from '../lib';
import {parse, stringify} from '../lib/himalaya';

/**
 * 工具栏-页面管理 Service
 */
export default class ToolsPageService extends Service {
  async index(entityManager: EntityManager, params: { projectID: string }): Promise<Icon[]> {
    const iconRepo = entityManager.getRepository(Icon);
    const iconList = await iconRepo.find({
      projectID: params.projectID,
    });
    return iconList;
  }

  async fetchIconfont(entityManager: EntityManager, params: { scriptUrl: string, projectID: string }): Promise<Icon[]> {
    const iconRepo = entityManager.getRepository(Icon);
    // 获取icon并格式化 { name: string, viewBox: string, symbol: string }
    const result = await this.ctx.curl(params.scriptUrl, {dataType: 'text'});
    const scriptContext: string = result.data;
    const svgText = scriptContext.match('\\<svg>.*\\</svg>');
    const icons: Array<{ name: string, viewBox: string, symbol: string }> = [];
    if (svgText) {
      const json = parse(svgText.toString())[0];
      if (!json.children) {
        return [];
      }
      json.children.forEach((symbol) => {
        const name = symbol.attributes ? symbol.attributes.find((attr) => {
          return attr.key === 'id';
        })!.value : '';
        const viewBox = symbol.attributes ? symbol.attributes.find((attr) => {
          return attr.key === 'viewBox';
        })!.value : '';
        icons.push({
          name: name,
          viewBox: viewBox,
          symbol: stringify(symbol.children),
        });
      });
    }
    // 删除现在的icon TODO 保存好版本
    await iconRepo.delete({
      projectID: params.projectID,
    })
    // 保存icon
    const iconList: Icon[] = [];
    for (const icon of icons) {
      const iconEntity = new Icon();
      iconEntity.fontClass = icon.name;
      iconEntity.svgContent = await this.ctx.renderView('icon.svg.ejs', {
        data: icon,
        ctx: this.ctx,
      });
      iconEntity.author = this.config.user.userID;
      iconEntity.projectID = params.projectID;
      await iconRepo.save(iconEntity);
      iconList.push(iconEntity);
    }
    return iconList;
  }

  async getIcon(entityManager: EntityManager, params: { fontClass: string, namespace?: string, projectID: string }): Promise<Icon> {
    const iconRepo = entityManager.getRepository(Icon);
    let icon = await iconRepo.findOne({
      projectID: params.projectID,
      fontClass: params.fontClass,
    });
    if (!icon) {
      icon = await iconRepo.findOne({
        projectID: params.projectID,
        fontClass: 'icon-iconfont',
      });
    }
    if (!icon) {
      throw ErrorService.RuntimeErrorNotFind();
    }
    return icon;
  }

  async generate(icons: Array<{ name: string, symbol: string }>): Promise<string> {
    const code = await this.ctx.renderView('icon.ts.ejs', {
      data: icons,
      ctx: this.ctx,
    });
    return code;
  }

  // a-b这种类型的字符串转换成驼峰
  toCamelCase(src: string, upperCaseFirstWord: boolean = true): string {
    if (!src) {
      return '';
    }
    // 首字母大写
    upperCaseFirstWord ? (src = src[0].toUpperCase() + src.slice(1)) : (src = src[0].toLowerCase() + src.slice(1));
    // 后面驼峰
    return src.replace(/[-_]([a-z])/g, (_match, $1) => {
      return $1.toUpperCase();
    });
  }
}
