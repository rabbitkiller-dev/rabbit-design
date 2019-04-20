import {Injectable, NgZone} from '@angular/core';
import {HtmlJson, parse, stringify} from 'himalaya';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {DesignDynamicHtmlJson, DesignHtmlJson, PageEditorServiceEvent, PageInfoModel} from './interface';
import {map} from 'rxjs/operators';
import {RaDesignTreeService} from '../../design-tree/ra-design-tree.service';
import {RUNTIME_EVENT_ENUM, RuntimeEventService} from '../../design-runtime/runtime-event.service';
import {DynamicUnitInterface, DynamicUnitServerInterface} from '../../design-dynamic/interface';
import {getTransformTransitionDurationInMs} from '../../cdk-drag-drop/transition-duration';

@Injectable({providedIn: 'root'})
export class PageEditorService {
  subjects: Map<string, Subject<PageEditorServiceEvent>> = new Map(); // 存储与page-editor.component订阅的事件
  pageInfos: Map<string, PageInfoModel> = new Map(); // 存储所有打开的page的信息

  /**
   * runtime data
   * htmlJson.get(stageID);
   * htmlJsonMaps.get(stageID).get(RabbitID);
   * selections.get(stageID);
   * dynamicUnits.get(stageID).get(RabbitID);
   */
  readonly htmlJsons: Map<string, DesignHtmlJson[]> = new Map(); // 存储html结构
  readonly htmlJsonMaps: Map<string, Map<string, DesignHtmlJson>> = new Map(); // 以key-value的形式存储的html
  readonly selections: Map<string, Set<string>> = new Map(); // 存储选中的html
  readonly dynamicUnits: Map<string, Map<string, DynamicUnitInterface>> = new Map(); // 存储动态组件的实例

  /**
   * hover
   */
  designHover: HTMLElement;
  currentHoverTarget: HTMLElement;
  designSelection: HTMLElement;

  constructor(
    public HttpClient: HttpClient,
    public NgZone: NgZone,
    public RuntimeEventService: RuntimeEventService,
  ) {
    window['pageEditor'] = this;
    // 舞台变化更新selection视图
    this.RuntimeEventService.on(RUNTIME_EVENT_ENUM.Stage_Click, (value) => {
      const selection = this.selections.get(value.id);
      const dynamicUnitMap = this.dynamicUnits.get(value.id);
      if (!selection) {
        this.designSelection.style.display = 'none';
        return;
      }
      dynamicUnitMap.forEach((value, key, map) => {
        if (selection.has(value.RabbitPath)) {
          const rect = value.ElementRef.nativeElement.getBoundingClientRect();
          this.designSelection.style.display = 'block';
          this.designSelection.style.width = rect.width + 'px';
          this.designSelection.style.height = rect.height + 'px';
          this.designSelection.style.transform = `translate3d(${Math.round(rect.left)}px, ${Math.round(rect.top)}px, 0)`;
        }
      });
    });
    this.RuntimeEventService.on(RUNTIME_EVENT_ENUM.StagePageEditor_HtmlJsonChange, (value) => {
      if (value.changeType !== 'delete') {
        return;
      }
      const selection = this.selections.get(value.stageID);
      const dynamicUnitMap = this.dynamicUnits.get(value.stageID);
      if (!selection || selection.size === 0) {
        this.designSelection.style.display = 'none';
        return;
      }
      dynamicUnitMap.forEach((value, key, map) => {
        if (selection.has(value.RabbitPath)) {
          const rect = value.ElementRef.nativeElement.getBoundingClientRect();
          this.designSelection.style.display = 'block';
          this.designSelection.style.width = rect.width + 'px';
          this.designSelection.style.height = rect.height + 'px';
          this.designSelection.style.transform = `translate3d(${Math.round(rect.left)}px, ${Math.round(rect.top)}px, 0)`;
        }
      });
    });
    this.designHover = document.createElement('div');
    this.designHover.id = 'design-hover';
    this.designSelection = document.createElement('div');
    this.designSelection.id = 'design-selection';
    const style = {
      pointerEvents: 'none',
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100px',
      height: '100px',
      zIndex: '1000',
      transition: 'transform 255ms',
      transitionProperty: 'transform,width,height',
    } as CSSStyleDeclaration;
    Object.assign(this.designHover.style, style, {
      display: 'none',
      boxShadow: '0 0 0 1px #51c1f8',
      // backgroundColor: 'rgba(81, 193, 248, 0.2)',
    });
    Object.assign(this.designSelection.style, style, {
      display: 'none',
      boxShadow: '0 0 0 1px #ee4743',
      backgroundColor: 'rgba(238, 71, 67, 0.2)',
    });
    document.body.append(this.designHover);
    document.body.append(this.designSelection);
    window.addEventListener('mousemove', ($event) => {
      // 判断是否已经点击,然后结束冒泡
      if ($event['designDynamicUnit_mouseenter']) {
        return;
      }
      this.designHover.style.display = 'none';
      this.currentHoverTarget = null;
      // 用事件冒泡告诉他们已经点击了 用这种方法不停止冒泡
      $event['designDynamicUnit_mouseenter'] = true;
    });
  }

  /**
   * editor runtime api
   */
  select(RabbitPath: string) {
    const stageID: string = RabbitPath.split('|')[0];
    let selection = this.selections.get(stageID);
    const dynamicUnitMap = this.dynamicUnits.get(stageID);
    // 如果已经选中了就不执行了
    if (selection && selection.has(RabbitPath)) {
      return;
    }
    if (!selection) {
      selection = new Set([RabbitPath]);
      this.selections.set(stageID, selection);
    }
    selection.clear();
    selection.add(RabbitPath);
    dynamicUnitMap.forEach((value, key, map) => {
      if (selection.has(value.RabbitPath)) {
        const rect = value.ElementRef.nativeElement.getBoundingClientRect();
        this.designSelection.style.display = 'block';
        this.designSelection.style.width = rect.width + 'px';
        this.designSelection.style.height = rect.height + 'px';
        this.designSelection.style.transform = `translate3d(${Math.round(rect.left)}px, ${Math.round(rect.top)}px, 0)`;
      }
    });
    this.RuntimeEventService.emit(RUNTIME_EVENT_ENUM.StagePageEditor_SelectionChange);
  }

  getSelection(stageID: string): string[] {
    return Array.from(this.selections.get(stageID) || []);
  }

  registerDynamicUnit(stageID: string, instance: DynamicUnitInterface) {
    const map = this.dynamicUnits.get(stageID);
    map.set(instance.RabbitID, instance);
    const pageInfo = this.pageInfos.get(stageID);
    const unit: DynamicUnitServerInterface = pageInfo.content.unitStructure[instance.RabbitID];
    if (unit) {
      Object.assign(instance, unit);
    }
  }

  /**
   * htmlJson change api
   */

  addRoot(stageID: string, htmlString: string);
  addRoot(stageID: string, htmlJsonArr: HtmlJson[]);
  addRoot(stageID: string, htmlJson: HtmlJson);
  addRoot(stageID: string, htmlJson: any) {
    const add = [];
    if (typeof htmlJson === 'string') {
      add.push(...parse(htmlJson));
    } else if (Array.isArray(htmlJson)) {
      add.push(...htmlJson);
    } else {
      add.push(htmlJson);
    }
    // 没有的话就初始化
    if (!this.htmlJsons.get(stageID)) {
      this.htmlJsons.set(stageID, []);
    }
    this.htmlJsons.get(stageID).push(...add);
    this.updateRabbitID(stageID, this.htmlJsons.get(stageID));
    this.updateDynamic(stageID);
  }

  insertBefore(path: string, htmlJson: string);
  insertBefore(path: string, htmlJson: HtmlJson[]);
  insertBefore(path: string, htmlJson: HtmlJson, origin?: string);
  insertBefore(path: string, htmlJson: any, origin?: string) {
    const add = [];
    if (typeof htmlJson === 'string') {
      add.push(...parse(htmlJson));
    } else if (Array.isArray(htmlJson)) {
      add.push(...htmlJson);
    } else {
      add.push(htmlJson);
    }
    const stageID: string = path.split('|')[0];
    const targetNode = this.getNodeJson(path);
    const targetParentNode = this.getParentNodeJson(path);
    targetParentNode.children.splice(targetParentNode.children.indexOf(targetNode), 0, ...add);
    if (origin) {
      const originParentNode = this.getParentNodeJson(path);
      originParentNode.children.splice(originParentNode.children.indexOf(htmlJson), 1);
    }
    this.updateRabbitID(stageID, this.htmlJsons.get(stageID));
    this.updateDynamic(stageID);
  }

  insertAfter(path: string, htmlJson: string);
  insertAfter(path: string, htmlJson: HtmlJson[]);
  insertAfter(path: string, htmlJson: HtmlJson, origin: string);
  insertAfter(path: string, htmlJson: any, origin?: string) {
    const add = [];
    if (typeof htmlJson === 'string') {
      add.push(...parse(htmlJson));
    } else if (Array.isArray(htmlJson)) {
      add.push(...htmlJson);
    } else {
      add.push(htmlJson);
    }
    const stageID: string = path.split('|')[0];
    const targetNode = this.getNodeJson(path);
    const targetParentNode = this.getParentNodeJson(path);
    targetParentNode.children.splice(targetParentNode.children.indexOf(targetNode) + 1, 0, ...add);
    if (origin) {
      const originParentNode = this.getParentNodeJson(path);
      originParentNode.children.splice(originParentNode.children.indexOf(htmlJson), 1);
    }
    this.updateRabbitID(stageID, this.htmlJsons.get(stageID));
    this.updateDynamic(stageID);
  }

  append(path: string, htmlJson: string);
  append(path: string, htmlJson: HtmlJson[]);
  append(path: string, htmlJson: HtmlJson, origin: string);
  append(path: string, htmlJson: any, origin?: string) {
    const add = [];
    if (typeof htmlJson === 'string') {
      add.push(...parse(htmlJson));
    } else if (Array.isArray(htmlJson)) {
      add.push(...htmlJson);
    } else {
      add.push(htmlJson);
    }
    const stageID: string = path.split('|')[0];
    const targetNode = this.getNodeJson(path);
    targetNode.children.push(...add);
    if (origin) {
      const originParentNode = this.getParentNodeJson(path);
      originParentNode.children.splice(originParentNode.children.indexOf(htmlJson), 1);
    }
    this.updateRabbitID(stageID, this.htmlJsons.get(stageID));
    this.updateDynamic(stageID);
  }

  getHtmlJson(stageID: string) {
    return this.htmlJsons.get(stageID);
  }

  deleteHtmlJson(stageID: string) {
    return this.htmlJsons.delete(stageID);
  }

  getNodeJson(RabbitPath: string): DesignHtmlJson {
    const stageID: string = RabbitPath.split('|')[0];
    const paths: string[] = RabbitPath.split('|')[1].split('/');
    let nodeJson: any = {children: this.getHtmlJson(stageID)};
    while (paths.length > 0) {
      const index = paths.shift();
      nodeJson = nodeJson.children.find((node) => {
        return node.RabbitID === index;
      });
    }
    return nodeJson;
  }

  deleteNodeJson(path: string) {
    const stageID = path.split('|')[0];
    const parent = this.getParentNodeJson(path);
    const target = this.getNodeJson(path);
    // 删除
    parent.children.splice(parent.children.indexOf(target), 1);
    // 删除选中
    const selection = this.selections.get(stageID);
    selection.delete(path);
    this.updateRabbitID(stageID, this.htmlJsons.get(stageID));
    this.RuntimeEventService.emit(RUNTIME_EVENT_ENUM.StagePageEditor_HtmlJsonChange, {
      changeType: 'delete',
      stageID: stageID,
      htmlJson: this.htmlJsons.get(stageID),
      nodeJson: target,
    });
    // 更新视图
    this.updateDynamic(stageID);
  }

  getParentNodeJson(path: string): HtmlJson {
    const stageID: string = path.split('|')[0];
    const paths: string[] = path.split('|')[1].split('/');
    let nodeJson: any = {children: this.getHtmlJson(stageID)};
    while (paths.length > 1) {
      const index = paths.shift();
      nodeJson = nodeJson.children.find((node) => {
        return node.RabbitID === index;
      });
    }
    return nodeJson;
  }

  updateRabbitID(stageID: string, htmlJson: HtmlJson[]) {
    const htmlJsonMap: Map<string, DesignHtmlJson> = new Map<string, DesignHtmlJson>();
    // 先初始化已有id到Map
    RaDesignTreeService.forEachTree(htmlJson, (nodeJson: DesignHtmlJson) => {
      const attr = nodeJson.attributes.find((attr) => {
        return attr.key === 'RabbitID' || attr.key === '[RabbitID]';
      });
      if (attr) {
        nodeJson.RabbitID = attr.value;
        htmlJsonMap.set(attr.value, nodeJson);
      }
    });
    // 初始化没有id的到Map
    RaDesignTreeService.forEachTree(htmlJson, (nodeJson: DesignHtmlJson) => {
      if (nodeJson.type !== 'element') {
        return;
      }
      const attr = nodeJson.attributes.find((attr) => {
        return attr.key === 'RabbitID' || attr.key === '[RabbitID]';
      });
      if (!attr) {
        nodeJson.RabbitID = this._generateId(htmlJsonMap, 'TempID:');
        nodeJson.attributes.push({
          key: 'RabbitID',
          value: nodeJson.RabbitID,
        });
        htmlJsonMap.set(nodeJson.RabbitID, nodeJson);
      }
    });
    this.htmlJsonMaps.delete(stageID);
    this.htmlJsonMaps.set(stageID, htmlJsonMap);
  }

  _generateId(htmlJsonMap: Map<string, DesignHtmlJson>, name: string): string {
    let index = 0;
    let id;
    // 一直循环到id唯一
    do {
      id = name + (index + 1);
      index++;
    } while (htmlJsonMap.get(id));
    return id;
  }

  /**
   * Renderer api
   */
  updateDynamic(stageID: string) {
    const htmlJsonMap = this.htmlJsonMaps.get(stageID);
    const copyHtmlJson = JSON.parse(JSON.stringify(this.getHtmlJson(stageID)));
    RaDesignTreeService.forEachTree(copyHtmlJson, (node: DesignDynamicHtmlJson) => {
      // 不是元素并且没有RabbitID就算了
      if (node.type !== 'element' || !node.RabbitID) {
        return;
      }

      if (!node.RabbitPath) {
        node.RabbitPath = `${stageID}|${node.RabbitID}`;
        htmlJsonMap.get(node.RabbitID).RabbitPath = node.RabbitPath;
        node.attributes.push({
          key: 'design-dynamic-unit',
          value: node.RabbitPath,
        });
      } else if (node.RabbitPath) {
        htmlJsonMap.get(node.RabbitID).RabbitPath = node.RabbitPath;
        node.attributes.push({
          key: 'design-dynamic-unit',
          value: node.RabbitPath,
        });
      }
      if (!node.children) {
        return;
      }
      node.children.forEach((childrenNode) => {
        // 不是元素并且没有RabbitID就算了
        if (childrenNode.type !== 'element' && !!childrenNode.RabbitID) {
          return;
        }
        childrenNode.RabbitPath = `${node.RabbitPath}/${childrenNode.RabbitID}`;
      });
    });
    this.dynamicUnits.delete(stageID);
    this.dynamicUnits.set(stageID, new Map());
    this.next(stageID, {
      stageID: stageID,
      type: 'update-dynamic-html',
      data: stringify(copyHtmlJson),
      selection: this.getSelection(stageID),
    });
  }

  hover($event, html?: HTMLElement) {
    const target: HTMLElement = html || $event.target;
    if (this.currentHoverTarget === target) {
      return;
    }
    this.currentHoverTarget = target;
    const rect = this.currentHoverTarget.getBoundingClientRect();
    this.designHover.style.display = 'block';
    this.designHover.style.width = rect.width + 'px';
    this.designHover.style.height = rect.height + 'px';
    this.designHover.style.transform = `translate3d(${Math.round(rect.left)}px, ${Math.round(rect.top)}px, 0)`;
  }

  _animateHover(ele: HTMLElement): Promise<void> {
    const duration = getTransformTransitionDurationInMs(ele);

    if (duration === 0) {
      return Promise.resolve();
    }

    return this.NgZone.runOutsideAngular(() => {
      return new Promise(resolve => {
        const handler = ((event: TransitionEvent) => {
          if (!event || (event.target === ele && event.propertyName === 'transform')) {
            ele.removeEventListener('transitionend', handler);
            resolve();
            clearTimeout(timeout);
          }
        }) as EventListenerOrEventListenerObject;

        // If a transition is short enough, the browser might not fire the `transitionend` event.
        // Since we know how long it's supposed to take, add a timeout with a 50% buffer that'll
        // fire if the transition hasn't completed when it was supposed to.
        const timeout = setTimeout(handler as Function, duration * 1.5);
        ele.addEventListener('transitionend', handler);
      });
    });
  }


  /**
   * Subject api
   */
  subscribe(stageID: string, next: (value: PageEditorServiceEvent) => void) {
    let subject = this.subjects.get(stageID);
    if (!subject) {
      subject = new Subject();
      this.subjects.set(stageID, subject);
    }
    subject.subscribe(next);
  }

  next(stageID, value: PageEditorServiceEvent) {
    const subject = this.subjects.get(stageID);
    subject.next(value);
    switch (value.type) {
      case 'update-dynamic-html':
        this.pageInfos.get(stageID).content.html = stringify(this.getHtmlJson(stageID));
        // TODO 增加渲染后的方法
        this.RuntimeEventService.emit(RUNTIME_EVENT_ENUM.StagePageEditor_UpdateDynamicHtml, value);
        setTimeout(() => {
          this.modify(stageID).subscribe(() => {
          });
        }, 200);
        break;
    }
  }

  /**
   * Http api
   */

  findOne(id: string): Observable<PageInfoModel> {
    return this.HttpClient.get(`api/tools-page/page-info/${id}`).pipe(map((result: any) => {
      const pageInfo: PageInfoModel = result.data;
      this.pageInfos.set(id, pageInfo);
      this.addRoot(id, pageInfo.content.html || '');
      return pageInfo;
    }));
  }

  modify(id: string): Observable<PageInfoModel> {
    const pageInfo = this.pageInfos.get(id);
    const unitStructure: {
      [index: string]: DynamicUnitServerInterface
    } = {};
    this.dynamicUnits.get(id).forEach((value, key, map) => {
      unitStructure[value.RabbitID] = {
        RabbitID: value.RabbitID,
        lookUnit: value.lookUnit,
        lookDrag: value.lookDrag,
        lookDrop: value.lookDrop,
        mergeParent: value.mergeParent,
        isContainer: value.isContainer,
      };
    });
    pageInfo.content.unitStructure = unitStructure;
    return this.HttpClient.put(`api/tools-page/page-info`, this.pageInfos.get(id)).pipe(map((result: any) => {
      return result.data;
    }));
  }
}

/**
 * 从PageEditor分出各个Stage的功能
 */
export class PageEditorChild {
  constructor(
    public stageID: string,
    public PageEditorService: PageEditorService,
  ) {
  }

  // 存储所有打开的page的信息
  get pageInfo(): PageInfoModel {
    return this.PageEditorService.pageInfos.get(this.stageID);
  }

  /**
   * runtime data
   * htmlJson.get(stageID);
   * htmlJsonMaps.get(stageID).get(RabbitID);
   * selections.get(stageID);
   * dynamicUnits.get(stageID).get(RabbitID);
   */
  // 存储html结构
  get htmlJson(): DesignHtmlJson[] {
    return this.PageEditorService.htmlJsons.get(this.stageID);
  }

  // 以key-value的形式存储的html
  get htmlJsonMap(): Map<string, DesignHtmlJson> {
    return this.PageEditorService.htmlJsonMaps.get(this.stageID);
  }

  // 存储选中的html
  get selection(): Set<string> {
    return this.PageEditorService.selections.get(this.stageID);
  }

  // 存储动态组件的实例
  get dynamicUnit(): Map<string, DynamicUnitInterface> {
    return this.PageEditorService.dynamicUnits.get(this.stageID);
  }

  generateId(name: string, dynamicUnit: DynamicUnitServerInterface = {}): string {
    const RabbitID = this.PageEditorService._generateId(this.htmlJsonMap, name);
    dynamicUnit.RabbitID = RabbitID;
    this.pageInfo.content.unitStructure[RabbitID] = Object.assign({
      lookUnit: false,
      lookDrag: true,
      lookDrop: false,
      mergeParent: false,
      isContainer: false,
      isSelect: false
    }, dynamicUnit);
    return RabbitID;
  }

  addRoot(htmlString: string);
  addRoot(htmlJsonArr: HtmlJson[]);
  addRoot(htmlJson: HtmlJson);
  addRoot(htmlJson: any) {
    this.PageEditorService.addRoot(this.stageID, htmlJson);
  }

  insertBefore(path: string, htmlJson: string);
  insertBefore(path: string, htmlJson: HtmlJson[]);
  insertBefore(path: string, htmlJson: HtmlJson, origin?: string);
  insertBefore(path: string, htmlJson: any, origin?: string) {
    this.PageEditorService.insertBefore(path, htmlJson, origin);
  }

  insertAfter(path: string, htmlJson: string);
  insertAfter(path: string, htmlJson: HtmlJson[]);
  insertAfter(path: string, htmlJson: HtmlJson, origin: string);
  insertAfter(path: string, htmlJson: any, origin?: string) {
    this.PageEditorService.insertBefore(path, htmlJson, origin);
  }

  append(path: string, htmlJson: string);
  append(path: string, htmlJson: HtmlJson[]);
  append(path: string, htmlJson: HtmlJson, origin: string);
  append(path: string, htmlJson: any, origin?: string) {
    this.PageEditorService.append(path, htmlJson, origin);
  }
}
