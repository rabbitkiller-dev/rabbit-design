import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DesignMenuModel} from '../../design-menu/interface';
import {map} from 'rxjs/operators';
import {PageModel, PageType, QueryToolsPageTreeDto, QueryToolsPageTreeNodeDto, Result, TreeDto} from './interface';
import {Observable} from 'rxjs';

export const PageContextMenuKey = {
  New: {
    Page: 'Page',
    Dir: 'Dir',
    Router2Dir: 'Router2Dir',
    ComponentDir: 'ComponentDir',
  },
  Copy: 'Copy',
  Delete: 'Delete',
};
export const PageContextMenu: {
  [index: string]: DesignMenuModel;
} = {
  Page: {
    label: 'Page',
    icon: 'fa-file',
    key: PageContextMenuKey.New.Page
  },
  Dir: {
    label: 'Dir',
    icon: 'fa-file',
    key: PageContextMenuKey.New.Dir
  },
  Router2Dir: {
    label: 'Router 2level Dir',
    icon: 'fa-file',
    key: PageContextMenuKey.New.Router2Dir
  },
  ComponentDir: {
    label: 'Components Dir',
    icon: 'fa-file',
    key: PageContextMenuKey.New.ComponentDir
  },
  Copy: {
    label: 'Copy',
    icon: 'fa-file',
    shortcut: 'Ctrl+c',
    key: PageContextMenuKey.Copy
  },
  Delete: {
    label: 'Delete',
    icon: 'fa-file',
    shortcut: 'Delete',
    key: PageContextMenuKey.Delete
  },
};

@Injectable()
export class PageService {
  constructor(public HttpClient: HttpClient) {

  }

  /**
   * Http api
   */
  index(): Observable<QueryToolsPageTreeDto[]> {
    return this.HttpClient.get('/api/tools-page', {}).pipe(map((result: Result<QueryToolsPageTreeDto[]>) => {
      return result.data;
    }));
  }

  add(page: PageModel): Observable<QueryToolsPageTreeNodeDto> {
    return this.HttpClient.post('/api/tools-page', page).pipe(map((result: Result<QueryToolsPageTreeNodeDto>) => {
      return result.data;
    }));
  }

  delete(pageID: string): Observable<void> {
    return this.HttpClient.delete('/api/tools-page', {params: {pageID: pageID}}).pipe(map((result: Result<void>) => {
      return result.data;
    }));
  }

  getContextMenu(page: PageModel): DesignMenuModel[] {
    switch (page.pageType) {
      case PageType.page:
        return [
          PageContextMenu.Copy,
          PageContextMenu.Delete,
        ];
      case PageType.dir:
        return [
          {
            label: 'New',
            icon: 'fa-file',
            items: [
              PageContextMenu.Page,
              PageContextMenu.Dir,
            ]
          },
          PageContextMenu.Delete,
        ];
      case PageType.router2:
        return [
          {
            label: 'New',
            icon: 'fa-file',
            items: [
              PageContextMenu.Page,
              PageContextMenu.Dir,
            ]
          },
          PageContextMenu.Delete,
        ];
      case PageType.component:
        return [
          {
            label: 'New',
            icon: 'fa-file',
            items: [
              PageContextMenu.Page,
              PageContextMenu.Dir,
            ]
          },
          PageContextMenu.Delete,
        ];
      default:
        return [
          {
            label: 'New',
            icon: 'fa-file',
            items: [
              PageContextMenu.Page,
              PageContextMenu.Dir,
              PageContextMenu.Router2Dir,
              PageContextMenu.ComponentDir,
            ]
          },
          PageContextMenu.Delete,
        ];
    }
  }
}
