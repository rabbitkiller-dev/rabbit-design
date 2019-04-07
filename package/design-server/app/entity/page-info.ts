import {Column, Entity} from 'typeorm';
import {Page} from './page';

/**
 * @table 页面信息
 * @author rabbit
 */
@Entity()
export class PageInfo extends Page {
  @Column('json')
  content: {
    ts: string,
    html: string,
    css: string,
    unitStructure: {
      [index: string]: {
        RabbitPath: string; // 他主要的HtmlJson的路径
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
  };
}
