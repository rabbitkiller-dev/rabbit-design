import {PageModel} from '../../design-tools/page/interface';
import {HtmlJson} from 'himalaya';

export interface PageInfoModel extends PageModel {
  content?: string; // 页面类型
}

export interface PageEditorServiceEvent {
  type: 'update-dynamic-html';
  data: any;
}

export interface DesignHtmlJson extends HtmlJson {
  __designPath: string;
  children: DesignHtmlJson[];
}
