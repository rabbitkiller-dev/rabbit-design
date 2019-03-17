export interface TreeDto {
  key?: string;
  parentKey?: string;
  title?: string;
  icon?: string;
  children?: any[];
  expanded?: boolean;
  leaf?: boolean;
}

export enum PageType {
  dir = 'dir',
  page = 'page',
  router2 = 'router2',
  component = 'component',
}
/**
 * @table 项目
 * @author rabbit
 */
export interface ProjectModel {
  projectID?: string; // 项目ID
  projectName?: string; // 项目名称
  projectDesc?: string; // 项目描述
  author?: string; // 创作者 @User.userID
  enable?: boolean; // 是否启用
}

export interface PageModel {
  pageID?: string; // 页面ID
  projectID?: string; // 项目ID @Project
  pageName?: string; // 页面名称
  pageDesc?: string; // 页面描述
  pageType?: PageType; // 页面类型
  parentPageID?: string; // 父页面ID
  pagePath?: string; // 页面ID路径
  author?: string; // 创作者 @User.userID
  enable?: boolean; // 是否启用
}

export interface QueryToolsPageTreeDto extends ProjectModel, TreeDto {
  children?: QueryToolsPageTreeNodeDto[];
}

export interface QueryToolsPageTreeNodeDto extends PageModel, TreeDto {

}
export interface Result<T> {
  success: boolean;
  msg: string;
  code: string;
  data: T;
}
