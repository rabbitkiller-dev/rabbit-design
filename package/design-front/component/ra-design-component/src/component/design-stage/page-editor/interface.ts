import {PageModel} from '../../design-tools/page/interface';
import {HtmlJson} from 'himalaya';

export interface PageInfoModel extends PageModel {
  content?: string; // 页面类型
}

export interface PageEditorServiceEvent {
  type: 'update-dynamic-html' | 'selectChange';
  data: any;
  stageID: string;
  selection?: string[];
}

export interface DesignHtmlJson extends HtmlJson {
  RabbitID: string;
  RabbitPath?: string;
  children: DesignHtmlJson[];
}
export interface DesignDynamicHtmlJson extends DesignHtmlJson {
  RabbitPath: string;
  children: DesignDynamicHtmlJson[];
}
