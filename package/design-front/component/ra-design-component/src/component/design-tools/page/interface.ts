import {TreeNodeModel} from '../../design-tree/tree-node.model';

export enum PageType {
  dir = 'dir',
  page = 'page',
  router2 = 'router2',
  component = 'component',
}

export class PageModel extends TreeNodeModel {
  pageID: string; // 页面ID
  projectID: string; // 项目ID @Project
  pageName: string; // 页面名称
  pageDesc: string; // 页面描述
  pageType: PageType; // 页面类型
  parentPageID: string; // 父页面ID
  pagePath: string; // 页面ID路径
  author: string; // 创作者 @User.userID
  enable: boolean; // 是否启用
}
