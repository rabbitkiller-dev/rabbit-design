import {RaDesignTreeService} from '../../design-tree/ra-design-tree.service';
import {ComponentInfo} from './interface';
import {PageEditorChild} from '../../design-stage/page-editor/page-editor.service';
import {HtmlJson, parse} from 'himalaya';

class IconModel implements ComponentInfo {
  getPlaceholder(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = '<i class="anticon" style="height: 1em;width: 1em;"></i>';
    return div.children[0] as HTMLElement;
  }

  createToPage(pageEditor: PageEditorChild): HtmlJson[] {
    const htmlJson = parse('<i nz-icon type="rabbit-design:icon-iconfont"></i>');
    htmlJson[0].attributes.push({
      key: 'RabbitID',
      value: pageEditor.generateId('Icon:'),
    });
    return htmlJson;
  }
}

class ButtonModel implements ComponentInfo {
  getPlaceholder(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = '<button class="ant-btn ant-btn-primary">Button</button>';
    return div.children[0] as HTMLElement;
  }

  createToPage(pageEditor: PageEditorChild): HtmlJson[] {
    const htmlJson = parse('<button nz-button nzType="primary">Button</button>');
    htmlJson[0].attributes.push({
      key: 'RabbitID',
      value: pageEditor.generateId('Button:'),
    });
    return htmlJson;
  }
}

class TopCenterBottomLayout implements ComponentInfo {
  getPlaceholder(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = `<nz-layout class="ant-layout">
  <nz-header class="ant-layout-header dynamic-blank"></nz-header>
  <nz-content class="ant-layout-content dynamic-blank"></nz-content>
  <nz-footer class="ant-layout-footer dynamic-blank"></nz-footer>
</nz-layout>`;
    return div.children[0] as HTMLElement;
  }

  createToPage(pageEditor: PageEditorChild): HtmlJson[] {
    const htmlJson = parse(`<nz-layout><nz-header></nz-header><nz-content></nz-content><nz-footer></nz-footer></nz-layout>`);
    htmlJson[0].attributes.push({
      key: 'RabbitID',
      value: pageEditor.generateId('Layout:', {lookDrop: true, isContainer: true}),
    });
    htmlJson[0].children[0].attributes.push({
      key: 'RabbitID',
      value: pageEditor.generateId('Header:', {lookDrag: true, mergeParent: true, isContainer: true}),
    });
    htmlJson[0].children[1].attributes.push({
      key: 'RabbitID',
      value: pageEditor.generateId('Content:', {lookDrag: true, mergeParent: true, isContainer: true}),
    });
    htmlJson[0].children[2].attributes.push({
      key: 'RabbitID',
      value: pageEditor.generateId('Footer:', {lookDrag: true, mergeParent: true, isContainer: true}),
    });
    return htmlJson;
  }
}

class InputForms implements ComponentInfo {
  getPlaceholder(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = `<input class="ant-input">`;
    return div.children[0] as HTMLElement;
  }

  createToPage(pageEditor: PageEditorChild): HtmlJson[] {
    const InputID = pageEditor.generateId('Input:');
    const htmlJson = parse(`<input nz-input RabbitID="${InputID}">`);
    return htmlJson;
  }
}

class Header1Group implements ComponentInfo {
  getPlaceholder(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = `<div style="width:100%"><div style="width: 120px;height: 31px;background: rgba(255, 255, 255, 0.2);margin: 16px 28px 16px 0;float: left;"></div>
        <ul style="line-height: 64px;"><li nz-menu-item>nav 1</li></ul></div>`;
    return div.children[0] as HTMLElement;
  }

  createToPage(pageEditor: PageEditorChild): HtmlJson[] {
    const HeaderID1 = pageEditor.generateId('Header1:');
    const LogoID = pageEditor.generateId('Logo:', {mergeParent: true});
    const MenuID = pageEditor.generateId('Menu:', {mergeParent: true});
    const MenuItemID1 = pageEditor.generateId('MenuItem:', {mergeParent: true});
    const MenuItemID2 = pageEditor.generateId('MenuItem:', {mergeParent: true}, 1);
    const MenuItemID3 = pageEditor.generateId('MenuItem:', {mergeParent: true}, 2);
    const htmlJson = parse(`<div style="width:100%" RabbitID="${HeaderID1}">
<div RabbitID="${LogoID}" style="width: 120px;height: 31px;background: rgba(255, 255, 255, 0.2);margin: 16px 28px 16px 0;float: left;"></div>
<ul nz-menu [nzTheme]="'dark'" [nzMode]="'horizontal'" style="line-height: 64px;" RabbitID="${MenuID}">
<li nz-menu-item RabbitID="${MenuItemID1}">nav 1</li>
<li nz-menu-item RabbitID="${MenuItemID2}">nav 2</li>
<li nz-menu-item RabbitID="${MenuItemID3}">nav 3</li>
</ul>
</div>`);
    return htmlJson;
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
createComponentInfo('general.icon', 'rabbit-design:icon-iconfont', IconModel);
createComponentInfo('general.button', 'rabbit-design:icon-button', ButtonModel);
createComponentInfo('layout');
createComponentInfo('layout.top-center-bottom', 'rabbit-design:icon-iconfont', TopCenterBottomLayout);
createComponentInfo('forms');
createComponentInfo('forms.input', 'rabbit-design:icon-input', InputForms);
createComponentInfo('completed');
createComponentInfo('completed.header-1-group', 'rabbit-design:icon-iconfont', Header1Group);
createComponentInfoOver();
let a = [
  {
    key: 'layout',
    title: 'layout',
    expanded: true,
    children: [
      {
        key: 'grid',
        title: 'grid',
        isLeaf: true,
        icon: 'rabbit-design:icon-button'
      },
      {
        key: 'top-center-bottom',
        title: 'top-center-bottom',
        isLeaf: true,
        icon: 'rabbit-design:icon-button'
      },
      {
        key: 'top-right-content',
        title: 'top-right-content',
        isLeaf: true,
        icon: 'rabbit-design:icon-button'
      },
      {
        key: 'top-left-content',
        title: 'top-right-content',
        isLeaf: true,
        icon: 'rabbit-design:icon-button'
      },
    ]
  },
  {
    key: 'navigation',
    title: 'navigation',
    expanded: true,
    children: [
      {
        key: 'affix',
        title: 'affix',
        isLeaf: true,
        icon: 'rabbit-design:icon-iconfont'
      },
      {
        key: 'breadcrumb',
        title: 'breadcrumb',
        isLeaf: true,
        icon: 'rabbit-design:icon-button'
      },
      {
        key: 'dropdown',
        title: 'dropdown',
        isLeaf: true,
        icon: 'rabbit-design:icon-button'
      },
      {
        key: 'menu',
        title: 'menu',
        isLeaf: true,
        icon: 'rabbit-design:icon-button'
      },
      {
        key: 'pagination',
        title: 'pagination',
        isLeaf: true,
        icon: 'rabbit-design:icon-button'
      },
      {
        key: 'steps',
        title: 'steps',
        isLeaf: true,
        icon: 'rabbit-design:icon-button'
      },
    ]
  },
]
