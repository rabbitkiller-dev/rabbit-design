/**
 * 提供对平台所有事件的触发和监听
 * 解决相互依赖监听事件的问题
 * 严格先声明到RUNTIME_EVENT_ENUM才能使用
 */
import {Injectable} from '@angular/core';
import {StageTabModel} from 'ra-design-component';

export enum RUNTIME_EVENT_ENUM {
  ToolsInterface_Minimize = 'ToolsInterface_Minimize', // 点击了最小化事件

  Stage_Open = 'Stage_Open', // 打开某个舞台
  StagePageEditor_SelectionChange = 'StagePageEditor_SelectionChange', // 选择变化
  StagePageEditor_UpdateDynamicHtml = 'StagePageEditor_UpdateDynamicHtml', // 更新动态html
  // tools工具栏
  Tools_Init = 'TOOLS_INIT', // tools工具栏初始化完毕
  Tools_Change = 'TOOLS_CHANGE', // tools工具栏因顺序被调整而变化
  Tools_Click = 'TOOLS_CLICK', // 点击tools工具栏
  // 设计页面树
  DesignPageTree_InitTree = 'DESIGNPAGETREE_INITTREE', // 初始化树
  DesignPageTree_InitMenu = 'DESIGNPAGETREE_INITMENU', // 初始化菜单
  DesignPageTree_DoubleClick = 'DESIGNPAGETREE_DOUBLECLICK', // 双击树
  // 数据源表结构
  DateSource_DoubleClick = 'DATESOURCE_DOUBLECLICK', // 双击表
  // 设计舞台
  DesignStage_ToolsChange = 'DESIGNSTAGE_TOOLSSELECT',
  DesignStage_ToolsSelect = 'DESIGNSTAGE_TOOLSSELECT',
  DesignStage_ToolsClose = 'DESIGNSTAGE_TOOLSCLOSE',
  DesignStage_ToolsAdd = 'DESIGNSTAGE_TOOLSADD',
  DesignStage_DoubleClick = 'DESIGNSTAGE_DOUBLECLICK',
  // 拖拽事件
  DragDrop_Start = 'DRAGDROP_START',
  DragDrop_Move = 'DRAGDROP_MOVE',
  DragDrop_End = 'DRAGDROP_END',
}

@Injectable({
  providedIn: 'root'
})
export class RuntimeEventService {
  private readonly _events: any;

  constructor() {
    this._events = Object.create(null);
    for (const runtimeEventKey of Object.keys(RUNTIME_EVENT_ENUM)) {
      const key = RUNTIME_EVENT_ENUM[runtimeEventKey];
      this._events[key] = [];
    }
  }

  addEventListener<T>(type: RUNTIME_EVENT_ENUM, listener: (value: T) => void) {
    this._addEventListener(type, listener, false);
  }

  prependEventListener<T>(type: RUNTIME_EVENT_ENUM, listener: (value: T) => void) {
    this._addEventListener(type, listener, true);
  }

  on<T>(type: any, listener: (value: T) => void) {
    this._addEventListener(type, listener, false);
    return () => {
      const existing: Array<Function> = this._events[type];
      if (!existing) {
        throw new Error(`not event : ${type}`);
      }
      existing.splice(existing.indexOf(listener, 1));
    };
  }

  /**
   */
  emit<T = any>(type: RUNTIME_EVENT_ENUM, value?: T) {
    const existing: Array<Function> = this._events[type];
    if (!existing) {
      throw new Error(`not event : ${type}`);
    }

    existing.forEach((listeners) => {
      listeners(value);
    });
  }

  private _addEventListener(type: RUNTIME_EVENT_ENUM, listener: Function, prepend: boolean) {
    if (typeof listener !== 'function') {
      throw new Error('listener not a function');
    }
    const existing = this._events[type];
    if (!existing) {
      throw new Error(`not event : ${type}`);
    }
    if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }
  }
}
