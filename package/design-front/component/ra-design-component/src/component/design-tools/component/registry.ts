import {RaDesignTreeService} from '../../design-tree/ra-design-tree.service';
import {ComponentInfo} from './interface';

class Icon implements ComponentInfo {
  getPlaceholder(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = '<i class="anticon" style="height: 1em;width: 1em;"></i>';
    return div.children[0] as HTMLElement;
  }
  createToPage() {
    return '<i nz-icon type="rabbit-design:icon-iconfont"></i>';
  }
}

export const ComponentTree = [];
export const ComponentMap = new Map<string, ComponentInfo>();

function createComponentInfo(key: string, icon?: string, entity?: any) {
  const paths = key.split('.');
  if (paths.length === 1) {
    ComponentTree.push({
      key: key,
      icon: icon,
      children: []
    });
  } else {
    paths.pop();
    const parentKey = paths.join('.');
    RaDesignTreeService.forEachTree(ComponentTree, (node) => {
      if (node.key === parentKey) {
        node.children.push({
          key: key,
          icon: icon,
          children: []
        });
      }
    });
  }
  if (entity) {
    ComponentMap.set(key, new entity());
  }
}

function createComponentInfoOver() {
  RaDesignTreeService.forEachTree(ComponentTree, (node) => {
    if (node.children.length === 0) {
      node.isLeaf = true;
    } else {
      node.expanded = true;
    }
  });
}

createComponentInfo('general');
createComponentInfo('general.icon', 'rabbit-design:icon-iconfont', Icon);
createComponentInfoOver();
