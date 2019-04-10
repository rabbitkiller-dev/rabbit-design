import {Injectable} from '@angular/core';
import {HtmlJson, parse, stringify} from 'himalaya';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {DesignDynamicHtmlJson, DesignHtmlJson, PageEditorServiceEvent, PageInfoModel} from './interface';
import {map} from 'rxjs/operators';
import {RaDesignTreeService} from '../../design-tree/ra-design-tree.service';
import {RUNTIME_EVENT_ENUM, RuntimeEventService} from '../../design-runtime/runtime-event.service';
import {DynamicUnitInterface, DynamicUnitServerInterface} from '../../design-dynamic/interface';

@Injectable({providedIn: 'root'})
export class PageEditorService {
  subjects: Map<string, Subject<PageEditorServiceEvent>> = new Map(); // 存储与page-editor.component订阅的事件
  pageInfos: Map<string, PageInfoModel> = new Map(); // 存储所有打开的page的信息
  instance: any;

  /**
   * runtime data
   * htmlJson.get(stageID);
   * htmlJsonMaps.get(stageID).get(RabbitID);
   * selections.get(stageID);
   * dynamicUnits.get(stageID).get(RabbitID);
   */
  private htmlJsons: Map<string, DesignHtmlJson[]> = new Map(); // 存储html结构
  private htmlJsonMaps: Map<string, Map<string, DesignHtmlJson>> = new Map(); // 以key-value的形式存储的html
  private selections: Map<string, Set<string>> = new Map(); // 存储选中的html
  readonly dynamicUnits: Map<string, Map<string, DynamicUnitInterface>> = new Map(); // 存储动态组件的实例

  constructor(
    public HttpClient: HttpClient,
    public RuntimeEventService: RuntimeEventService,
  ) {
  }

  /**
   * editor runtime api
   */
  select(RabbitPath: string, instance?: any) {
    this.instance = instance;
    const stageID: string = RabbitPath.split('|')[0];
    // const RabbitID: string = this.getNodeJson(RabbitPath).RabbitID;
    const selection = this.selections.get(stageID);
    const dynamicUnitMap = this.dynamicUnits.get(stageID);
    // 如果已经选中了就不执行了
    if (selection && selection.has(RabbitPath)) {
      return;
    }
    if (selection) {
      selection.clear();
      selection.add(RabbitPath);
    } else {
      this.selections.set(stageID, new Set([RabbitPath]));
    }
    dynamicUnitMap.forEach((value, key, map) => {
      value.isSelect = selection.has(value.RabbitPath);
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
    // 更新视图
    this.updateDynamic(stageID);
  }

  getParentNodeJson(path: string): HtmlJson {
    const stageID: string = path.split('|')[0];
    const paths: string[] = path.split('|')[1].split('/');
    let nodeJson: any = {children: this.getHtmlJson(stageID)};
    while (paths.length > 1) {
      const index = paths.shift();
      nodeJson = nodeJson.children[index];
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
        nodeJson.RabbitID = this._generateId(htmlJsonMap, nodeJson.tagName);
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
      id = name + (index === 0 ? '' : index);
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
      if (!node.RabbitPath && node.type === 'element') {
        node.RabbitPath = `${stageID}|${node.RabbitID}`;
        htmlJsonMap.get(node.RabbitID).RabbitPath = node.RabbitPath;
        node.attributes.push({
          key: 'design-dynamic-unit',
          value: node.RabbitPath,
        });
      } else if (node.RabbitPath && node.type === 'element') {
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
