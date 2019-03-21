import {Injectable} from '@angular/core';
import {HtmlJson, parse, stringify} from 'himalaya';
import {PageEditorInterface} from './page-editor.interface';
import {Subject} from 'rxjs';

interface DesignHtmlJson extends HtmlJson {
  __designPath: string;
  children: DesignHtmlJson[];
}

@Injectable({providedIn: 'root'})
export class PageEditorService extends Subject<{ type: 'html', data: any }> {
  htmlJson: HtmlJson[] = [];
  PageEditorInterface: PageEditorInterface;

  addRoot(htmlJson: string);
  addRoot(htmlJson: HtmlJson[]);
  addRoot(htmlJson: HtmlJson);
  addRoot(htmlJson: any) {
    const add = [];
    if (typeof htmlJson === 'string') {
      add.push(...parse(htmlJson));
    } else if (Array.isArray(htmlJson)) {
      add.push(...htmlJson);
    } else {
      add.push(htmlJson);
    }
    this.htmlJson.push(...add);
    // this.PageEditorInterface.html = '<i design-dynamic-unit="i/i"></i>';
    // this.PageEditorInterface.html = '<i nz-icon type="rabbit-design:icon-iconfont"><i design-dynamic-unit="i/i"></i></i>';
    this.PageEditorInterface.html = this.stringify(this.htmlJson);
    this.PageEditorInterface.ChangeDetectorRef.markForCheck();
  }

  stringify(htmlJson: HtmlJson[]): string {
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
        node.__designPath = node.tagName;
        node.attributes.push({
          key: 'design-dynamic-unit',
          value: node.__designPath,
        });
      }
      node.children.forEach((childrenNode) => {
        childrenNode.__designPath = `${node.__designPath}/${node.tagName}`;
      });
    });
    return stringify(copyHtmlJson);
  }

  getNodeJson(path: string): HtmlJson {
    const paths: string[] = path.split('/');
    let nodeJson: any = {children: this.htmlJson};
    while (paths.length > 0) {
      const tagName = paths.shift();
      nodeJson = nodeJson.children.find((htmlJson) => {
        return htmlJson.tagName === tagName;
      });
    }
    return nodeJson;
  }
}
