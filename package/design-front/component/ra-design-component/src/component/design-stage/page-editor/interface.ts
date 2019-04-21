import {PageModel} from '../../design-tools/page/interface';
import {HtmlJson} from 'himalaya';
import {DynamicUnitServerInterface} from '../../design-dynamic/interface';

export interface PageInfoModel extends PageModel {
  content?: {
    ts: string,
    html: string,
    css: string,
    unitStructure: {
      [index: string]: DynamicUnitServerInterface,
    },
    propertiesStructure: {},
  }; // 页面类型
}

export interface PageEditorServiceEvent {
  type: 'update-dynamic-html' | 'selectChange';
  data: any;
  stageID: string;
  selection?: string[];
}

export interface DesignHtmlJson extends HtmlJson {
  RabbitID: string;
  children: DesignHtmlJson[];
}

export interface DesignDynamicHtmlJson extends DesignHtmlJson {
  RabbitPath: string;
  children: DesignDynamicHtmlJson[];
}

export interface HtmlJsonChangeEvent {
  changeType: 'add' | 'modify' | 'delete';
  stageID: string;
  htmlJson: DesignHtmlJson[];
  nodeJson: DesignHtmlJson;
}
