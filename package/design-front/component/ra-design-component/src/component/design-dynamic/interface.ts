/**
 * margeParent/lookUnit/lookUnit : no drag
 */
import {ElementRef} from '@angular/core';
import {HtmlJson} from 'himalaya';

export interface DynamicUnitInterface {
  ElementRef?: ElementRef;
  path: string; // 他主要的HtmlJson的路径
  lookUnit?: boolean; // 锁定单元
  lookDrag?: boolean; // 锁定拖拽
  lookDrop?: boolean; // 锁定拖放
  mergeParent?: boolean; // 合并父级
  isContainer?: boolean; // 是否是容器
  data?: HtmlJson;
}
