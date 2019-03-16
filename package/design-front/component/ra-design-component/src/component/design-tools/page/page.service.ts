import {DesignMenuModel} from '../../design-menu/interface';

export const PageContextMenuKey = {
  New: {File: 'newFile'}
};

export class PageService {
  /**
   * Http api
   * @param node
   */
  query() {

  }

  getContextMenu(node): DesignMenuModel[] {
    console.log(PageContextMenuKey.New.File);
    return [
      {
        'label': 'New',
        'icon': 'fa-file',
        'items': [
          {
            'label': 'File',
            'icon': 'fa-file',
            'key': PageContextMenuKey.New.File
          }
        ]
      },
      {
        'label': 'Copy',
        'icon': 'fa-file',
        'shortcut': 'ctrl+c'
      },
      {
        'label': 'Cut',
        'icon': 'fa-file',
        'shortcut': 'ctrl+x',
        'items': []
      }
    ];
  }
}
