import {Injectable} from '@angular/core';
import {HtmlJson, parse, stringify} from 'himalaya';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {DesignDynamicHtmlJson, DesignHtmlJson, PageEditorServiceEvent, PageInfoModel} from './interface';
import {map} from 'rxjs/operators';
import {RaDesignTreeService} from '../../design-tree/ra-design-tree.service';
import {RUNTIME_EVENT_ENUM, RuntimeEventService} from '../../design-runtime/runtime-event.service';
import {DynamicUnitInterface} from '../../design-dynamic/interface';

@Injectable({providedIn: 'root'})
export class PageEditorService {
  private subjects: Map<string, Subject<PageEditorServiceEvent>> = new Map();
  private htmlJsons: Map<string, DesignHtmlJson[]> = new Map();
  private htmlJsonMaps: Map<string, Map<string, DesignHtmlJson>> = new Map();
  private selections: Map<string, Set<string>> = new Map();
  instance: any;
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
    const selection = this.selections.get(stageID);
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
    this.RuntimeEventService.emit(RUNTIME_EVENT_ENUM.StagePageEditor_SelectionChange);
  }

  getSelection(stageID: string): string[] {
    return Array.from(this.selections.get(stageID) || []);
  }

  /**
   * htmlJson change api
   */

  addRoot(stageID: string, htmlJson: string);
  addRoot(stageID: string, htmlJson: HtmlJson[]);
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
    this.next(stageID, {
      stageID: stageID,
      type: 'update-dynamic-html',
      data: this.stringify(stageID, this.getHtmlJson(stageID))
    });
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
    this.next(stageID, {
      stageID: stageID,
      type: 'update-dynamic-html',
      data: this.stringify(stageID, this.getHtmlJson(stageID))
    });
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
    this.next(stageID, {
      stageID: stageID,
      type: 'update-dynamic-html',
      data: this.stringify(stageID, this.getHtmlJson(stageID))
    });
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
    this.next(stageID, {
      stageID: stageID,
      type: 'update-dynamic-html',
      data: this.stringify(stageID, this.getHtmlJson(stageID))
    });
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
    this.next(stageID, {
      stageID: stageID,
      type: 'update-dynamic-html',
      data: this.stringify(stageID, this.getHtmlJson(stageID))
    });
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
  stringify(stageID: string, htmlJson: DesignHtmlJson[]): string {
    const htmlJsonMap = this.htmlJsonMaps.get(stageID);
    const copyHtmlJson = JSON.parse(JSON.stringify(htmlJson));
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
    return stringify(copyHtmlJson);
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
        this.RuntimeEventService.emit(RUNTIME_EVENT_ENUM.StagePageEditor_UpdateDynamicHtml, value);
        break;
    }
  }

  /**
   * Http api
   */

  findOne(id: string): Observable<PageInfoModel> {
    return this.HttpClient.get(`api/tools-page/page-info/${id}`).pipe(map((result: any) => {
      return result.data;
    }));
  }

  modify(page: PageInfoModel): Observable<PageInfoModel> {
    return this.HttpClient.put(`api/tools-page/page-info`, page).pipe(map((result: any) => {
      return result.data;
    }));
  }
}
