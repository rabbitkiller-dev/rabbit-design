import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DesignMenuModel} from '../../design-menu/interface';
import {map} from 'rxjs/operators';
import {PageModel, PageType, QueryToolsPageTreeDto, Result} from './interface';
import {Observable} from 'rxjs';

export const PageContextMenuKey = {
  New: {
    Page: 'Page',
    Dir: 'Dir',
    Router2Dir: 'Router2Dir',
    ComponentDir: 'ComponentDir',
  },
  Copy: 'Copy',
};
export const PageContextMenu = {
  Page: {
    'label': 'Page',
    'icon': 'fa-file',
    'key': PageContextMenuKey.New.Page
  },
  Dir: {
    'label': 'Dir',
    'icon': 'fa-file',
    'key': PageContextMenuKey.New.Dir
  },
  Router2Dir: {
    'label': 'Router 2level Dir',
    'icon': 'fa-file',
    'key': PageContextMenuKey.New.Router2Dir
  },
  ComponentDir: {
    'label': 'Components Dir',
    'icon': 'fa-file',
    'key': PageContextMenuKey.New.ComponentDir
  }
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

  add(page: PageModel): Observable<PageModel> {
    return this.HttpClient.post('/api/tools-page', page).pipe(map((result: Result<PageModel>) => {
      return result.data;
    }));
  }

  getContextMenu(page: PageModel): DesignMenuModel[] {
    switch (page.pageType) {
      case PageType.page:
        return [PageContextMenu.Page];
      default:
        return [{
          'label': 'New',
          'icon': 'fa-file',
          'items': [
            PageContextMenu.Page,
            PageContextMenu.Dir,
            PageContextMenu.Router2Dir,
            PageContextMenu.ComponentDir,
          ]
        }];
    }
    /*{
      'label': 'Copy',
      'icon': 'fa-file',
      'shortcut': 'ctrl+c'
    },
    {
      'label': 'Cut',
      'icon': 'fa-file',
      'shortcut': 'ctrl+x',
      'items': []
    }*/
  }
}
