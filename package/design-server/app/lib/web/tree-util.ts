import {TreeDto} from '../../dto/tree.dto';

interface DefaultDataTree {
  key?: string | Function;
  parentKey?: string | Function;
  title?: string | Function;
  icon?: string | Function;
  children?: any[] | Function;
  expanded?: boolean | Function;
  isLeaf?: boolean | Function;
}

export interface TreeRules {
  key?: ((data: any) => string | boolean | any[]) | string;
  parentKey?: ((data: any) => string | boolean | any[]) | string;
  title?: ((data: any) => string | boolean | any[]) | string;
  icon?: string;
  children?: ((data: any) => string | boolean | any[]) | string;
  expanded?: ((data: any) => string | boolean | any[]) | string;
  isLeaf?: ((data: any) => string | boolean | any[]) | string;
}

export const defulatRules: TreeRules = {
  key: 'id',
  parentKey: 'parentID',
  title: 'name',
  icon: 'icon',
  children: 'children',
  expanded: 'expanded',
  isLeaf: 'leaf',
};

export class TreeUtil {
  // 自动设置树节点属性
  static autoSetToDefulatRules(data: any, defaultData: DefaultDataTree = {}) {
    return this.autoSet(defulatRules, data, defaultData);
  }

  // 添加/覆盖
  static autoSet<T>(rules: TreeRules, data: T, defaultData?: DefaultDataTree): TreeDto & T;
  static autoSet<T>(rules: TreeRules, data: T[], defaultData: DefaultDataTree = {}): Array<TreeDto & T> {
    const _rules = Object.assign({}, defulatRules, rules);
    if (Array.isArray(data)) {
      data.forEach((_d) => {
        this.autoSet(_rules, _d, defaultData);
      });
      return data as Array<TreeDto & T>;
    } else {
      Object.keys(_rules).forEach((property) => {
        TreeUtil._runRule(data, property, _rules[property], defaultData[property]);
      });
      return data as any;
    }
  }

  // 整合成树
  static format<T>(list: Array<TreeDto & T>): Array<TreeDto & T> {
    const map: Map<string, TreeDto> = new Map<string, TreeDto>();
    list.forEach((tree) => {
      if (!map.get(tree.key!)) {
        map.set(tree.key!, tree);
      } else {
        throw new Error('format list to tree; Tree.key repeat');
      }
    });
    const result: Array<TreeDto & T> = [];
    list.forEach((tree) => {
      // 没有上级
      if (!tree.parentKey) {
        result.push(tree);
      }
      const parentTree = map.get(tree.parentKey!);
      if (parentTree) { // 找到上级
        Array.isArray(parentTree.children) ? parentTree.children.push(tree) : parentTree.children = [tree];
      } else { // 没找到上级
        result.push(tree);
      }
    });
    return result;
  }

  static _runRule(data: any, property, rule: string, defulatData: ((data: any) => string | boolean | any[]) | string | boolean | any[]) {
    if (data[property]) {
      return;
    }
    let propertyValue = data[rule];
    if (!propertyValue && defulatData) {
      propertyValue = typeof defulatData === 'function' ? defulatData(data) : defulatData;
    }
    data[property] = propertyValue;
  }
}
