import {Controller} from 'egg';
import {EntityManager} from 'typeorm';
import {QueryToolsPageTreeDto, QueryToolsPageTreeNodeDto} from '../dto/tools-page.dto';
import {Page, PageType} from '../entity/page';
import {Project} from '../entity/project';
import {ErrorService} from '../lib';
import {TreeUtil} from '../lib/web/tree-util';

import * as uuidv1 from 'uuid/v1';

/**
 * 工具栏-页面管理 Service
 */
export default class ToolsPageService extends Controller {

  public async queryToolsPageTree(entityManager: EntityManager, params: { projectID: string }): Promise<QueryToolsPageTreeDto[]> {
    const projectRepo = entityManager.getRepository(Project);
    const result: QueryToolsPageTreeDto = TreeUtil.autoSet({
      key: 'projectID',
      title: 'projectName',
    }, await projectRepo.findOne({projectID: params.projectID, enable: true}), {
      icon: 'table',
      expanded: true,
      parentKey: '-1',
    });
    result.children = TreeUtil.format(this.formatPageToTree(await this.queryPageByProject(entityManager, params)));
    return [result];
  }

  public async queryPageByProject(entityManager: EntityManager, params: { projectID: string }): Promise<Page[]> {
    const pageRepo = entityManager.getRepository(Page);
    const result: Page[] = await pageRepo.find({projectID: params.projectID, enable: true});
    return result;
  }

  public async savePage(entityManager: EntityManager, page: Page): Promise<QueryToolsPageTreeNodeDto> {
    const pageRepo = entityManager.getRepository(Page);
    const parentPage: Page | undefined = page.parentPageID ? await pageRepo.findOne({
      pageID: page.parentPageID,
      enable: true,
    }) : undefined;

    page.pageID = uuidv1();
    if (page.parentPageID && !parentPage) { // 没找到父节点
      ErrorService.RuntimeErrorNotFind();
    } else if (parentPage) {
      page.pagePath = `${parentPage.pagePath}/${page.pageID}`;
    } else {
      page.pagePath = `${this.config.user.projectID}/${page.pageID}`;
      page.parentPageID = this.config.user.projectID;
    }
    page.enable = true;
    page.author = this.config.user.userID;
    page.projectID = this.config.user.projectID;
    return this.formatPageToTree(await pageRepo.save(page));
  }

  public async deletePage(entityManager: EntityManager, id: string) {
    const pageRepo = entityManager.getRepository(Page);
    await pageRepo.delete({pageID: id});
  }

  formatPageToTree(page: Page[]): QueryToolsPageTreeNodeDto[];
  formatPageToTree(page: Page): QueryToolsPageTreeNodeDto;
  formatPageToTree(page: any): any {
    return TreeUtil.autoSet({
      key: 'pageID',
      title: 'pageName',
      parentKey: 'parentPageID',
    }, page, {
      icon: (item) => {
        switch (item.pageType) {
          case PageType.page:
            return 'file';
          case PageType.dir:
            return 'folder';
          case PageType.router2:
            return 'cluster';
          case PageType.component:
            return 'appstore';
          default:
            break;
        }
      },
      isLeaf: (item) => item.pageType === PageType.page,
    });
  }
}
