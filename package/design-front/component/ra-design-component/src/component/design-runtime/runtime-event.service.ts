/**
 * 提供对平台所有事件的触发和监听
 * 解决相互依赖监听事件的问题
 * 严格先声明到RUNTIME_EVENT_ENUM才能使用
 */
import {Injectable} from '@angular/core';
import {ToolsFactory} from '../design-tools/ra-design-tools.service';
import {StageTabModel} from '../design-stage/interface';
import {HtmlJsonChangeEvent, PageEditorServiceEvent} from '../design-stage/page-editor/interface';

export enum RUNTIME_EVENT_ENUM {
  ToolsInterface_Minimize, // 点击了最小化事件
  Stage_Put, // 在stage list推入了一个新的stage
  Stage_Open, // 打开某个舞台
  Stage_Click, // 点击某个舞台
  StagePageEditor_SelectionChange, // 选择变化
  StagePageEditor_UpdateDynamicHtml, // 更新动态html
  StagePageEditor_DynamicAfterViewInit, // 动态组件视图初始化完毕
  StagePageEditor_HtmlJsonChange, // htmlJson变化
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

  on(type: RUNTIME_EVENT_ENUM.ToolsInterface_Minimize, listener: (value: ToolsFactory) => void);
  on(type: RUNTIME_EVENT_ENUM.Stage_Open, listener: (value: StageTabModel) => void);
  on(type: RUNTIME_EVENT_ENUM.Stage_Put, listener: (value: StageTabModel) => void);
  on(type: RUNTIME_EVENT_ENUM.Stage_Click, listener: (value: StageTabModel) => void);
  on(type: RUNTIME_EVENT_ENUM.StagePageEditor_UpdateDynamicHtml, listener: (value: PageEditorServiceEvent) => void);
  on(type: RUNTIME_EVENT_ENUM.StagePageEditor_SelectionChange, listener: (value: void) => void);
  on(type: RUNTIME_EVENT_ENUM.StagePageEditor_DynamicAfterViewInit, listener: (value: string) => void);
  on(type: RUNTIME_EVENT_ENUM.StagePageEditor_HtmlJsonChange, listener: (value: HtmlJsonChangeEvent) => void);
  on<T>(type: any, listener: (value: T) => void): () => void {
    this._addEventListener(type, listener, false);
    return () => {
      const existing: Array<Function> = this._events[type];
      if (!existing) {
        throw new Error(`not event : ${type}`);
      }
      existing.splice(existing.indexOf(listener, 1));
    };
  }

  emit(type: RUNTIME_EVENT_ENUM.ToolsInterface_Minimize, value: ToolsFactory);
  emit(type: RUNTIME_EVENT_ENUM.Stage_Put, StageTabModel);
  emit(type: RUNTIME_EVENT_ENUM.Stage_Open, value: StageTabModel);
  emit(type: RUNTIME_EVENT_ENUM.Stage_Click, value: StageTabModel);
  emit(type: RUNTIME_EVENT_ENUM.StagePageEditor_UpdateDynamicHtml, value: PageEditorServiceEvent);
  emit(type: RUNTIME_EVENT_ENUM.StagePageEditor_SelectionChange, value: void);
  emit(type: RUNTIME_EVENT_ENUM.StagePageEditor_DynamicAfterViewInit, value: string);
  emit(type: RUNTIME_EVENT_ENUM.StagePageEditor_HtmlJsonChange, value: HtmlJsonChangeEvent);
  emit<T = any>(type: any, value?: T) {
    const existing: Array<Function> = this._events[type];
    if (!existing) {
      throw new Error(`not event : ${type}`);
    }

    existing.forEach((listeners) => {
      listeners(value);
    });
  }

  addEventListener<T>(type: RUNTIME_EVENT_ENUM, listener: (value: T) => void) {
    this._addEventListener(type, listener, false);
  }

  prependEventListener<T>(type: RUNTIME_EVENT_ENUM, listener: (value: T) => void) {
    this._addEventListener(type, listener, true);
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
