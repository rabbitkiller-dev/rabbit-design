import {Injectable} from '@angular/core';
import {HtmlJson, parse, stringify} from 'himalaya';
import {Observable, Observer, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {DesignHtmlJson, PageEditorServiceEvent, PageInfoModel} from './interface';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PageEditorService {
  private subjects: Map<string, Subject<PageEditorServiceEvent>> = new Map();
  private htmlJsons: Map<string, HtmlJson[]> = new Map();

  constructor(public HttpClient: HttpClient) {
  }

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
    this.next(stageID, {type: 'update-dynamic-html', data: this.stringify(stageID, this.getHtmlJson(stageID))});
  }

  insertBefore(path: string, htmlJson: string);
  insertBefore(path: string, htmlJson: HtmlJson[]);
  insertBefore(path: string, htmlJson: HtmlJson);
  insertBefore(path: string, htmlJson: any) {
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
    this.next(stageID, {type: 'update-dynamic-html', data: this.stringify(stageID, this.getHtmlJson(stageID))});
  }

  insertAfter(path: string, htmlJson: string);
  insertAfter(path: string, htmlJson: HtmlJson[]);
  insertAfter(path: string, htmlJson: HtmlJson);
  insertAfter(path: string, htmlJson: any) {
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
    this.next(stageID, {type: 'update-dynamic-html', data: this.stringify(stageID, this.getHtmlJson(stageID))});
  }

  getHtmlJson(stageID: string) {
    return this.htmlJsons.get(stageID);
  }

  deleteHtmlJson(stageID: string) {
    return this.htmlJsons.delete(stageID);
  }

  getNodeJson(path: string): HtmlJson {
    const stageID: string = path.split('|')[0];
    const paths: string[] = path.split('|')[1].split('/');
    let nodeJson: any = {children: this.getHtmlJson(stageID)};
    while (paths.length > 0) {
      const index = paths.shift();
      nodeJson = nodeJson.children[index];
    }
    return nodeJson;
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

  stringify(stageID: string, htmlJson: HtmlJson[]): string {
    const copyHtmlJson = JSON.parse(JSON.stringify(htmlJson));
    const forEachTree = (node: any[], call) => {
      node.forEach((_n) => {
        if (call(_n)) {
          return true;
        }
        if (_n.children && _n.children.length > 0) {
          forEachTree(_n.children, call);
        }
      });
    };
    forEachTree(copyHtmlJson, (node: DesignHtmlJson) => {
      if (!node.__designPath && node.type === 'element') {
        node.__designPath = `${stageID}|${copyHtmlJson.indexOf(node).toString()}`;
        node.attributes.push({
          key: 'design-dynamic-unit',
          value: node.__designPath,
        });
        node.attributes.push({
          key: 'design-stage-id',
          value: stageID,
        });
      } else if (node.__designPath && node.type === 'element') {
        node.attributes.push({
          key: 'design-dynamic-unit',
          value: node.__designPath,
        });
        node.attributes.push({
          key: 'design-stage-id',
          value: stageID,
        });
      }
      node.children.forEach((childrenNode) => {
        childrenNode.__designPath = `${node.__designPath}/${node.children.indexOf(childrenNode)}`;
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
  }

  /**
   * Http api
   */

  findOne(id: string): Observable<PageInfoModel> {
    return this.HttpClient.get(`/api/tools-page/page-info/${id}`).pipe(map((result: any) => {
      return result.data;
    }));
  }

  modify(page: PageInfoModel): Observable<PageInfoModel> {
    return this.HttpClient.put(`/api/tools-page/page-info`, page).pipe(map((result: any) => {
      return result.data;
    }));
  }
}
