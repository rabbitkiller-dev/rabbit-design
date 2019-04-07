import {PageModel} from '../../design-tools/page/interface';
import {HtmlJson} from 'himalaya';

export interface PageInfoModel extends PageModel {
  content?: {
    ts: string,
    html: string,
    css: string,
    unitStructure: {
      [index: string]: {
        RabbitID: string; // ID
        lookUnit?: boolean; // 锁定单元
        lookDrag?: boolean; // 锁定拖拽
        lookDrop?: boolean; // 锁定拖放
        mergeParent?: boolean; // 合并父级
        isContainer?: boolean; // 是否是容器
      },
    },
    propertiesStructure: {
    },
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
  RabbitPath?: string;
  children: DesignHtmlJson[];
}
export interface DesignDynamicHtmlJson extends DesignHtmlJson {
  RabbitPath: string;
  children: DesignDynamicHtmlJson[];
}
