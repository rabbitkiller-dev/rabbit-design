import {Service} from 'egg';
import {EntityManager} from 'typeorm';
import {QueryPageInfo, QueryToolsPageTreeDto, QueryToolsPageTreeNodeDto} from '../dto/tools-page.dto';
import {Page, PageType} from '../entity/page';
import {Project} from '../entity/project';
import {ErrorService} from '../lib';
import {TreeUtil} from '../lib/web/tree-util';

import * as uuidv1 from 'uuid/v1';
import {PageInfo} from '../entity/page-info';

/**
 * 工具栏-页面管理 Service
 */
export default class ToolsPageService extends Service {

  public async queryToolsPageTree(entityManager: EntityManager, params: { projectID: string }): Promise<QueryToolsPageTreeDto[]> {
    const projectRepo = entityManager.getRepository(Project);
    const result: QueryToolsPageTreeDto = TreeUtil.autoSet({
      key: 'projectID',
      title: 'projectName',
    }, await projectRepo.findOne({projectID: params.projectID, enable: true}), {
      icon: 'rabbit-design:icon-server',
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
      throw ErrorService.RuntimeErrorNotFind();
    } else if (parentPage) {
      page.pagePath = `${parentPage.pagePath}/${page.pageID}`;
    } else {
      page.pagePath = `${this.config.user.projectID}/${page.pageID}`;
      page.parentPageID = this.config.user.projectID;
    }
    page.enable = true;
    page.author = this.config.user.userID;
    page.projectID = this.config.user.projectID;

    await entityManager.getRepository(PageInfo).save(page);
    return this.formatPageToTree(await pageRepo.save(page));
  }

  public async findOne(entityManager: EntityManager, id: string): Promise<QueryPageInfo> {
    const pageInfoRepo = entityManager.getRepository(PageInfo);
    const parentPage = await pageInfoRepo.findOne({
      pageID: id,
      enable: true,
    });
    if (parentPage) {
      return parentPage;
    }
    throw ErrorService.RuntimeErrorNotFind();
  }

  public async pageInfoModify(entityManager: EntityManager, pageInfo: PageInfo): Promise<QueryPageInfo> {
    pageInfo = await entityManager.getRepository(PageInfo).save(pageInfo);
    return pageInfo;
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
            return 'rabbit-design:icon-page';
          case PageType.dir:
            return 'rabbit-design:icon-folder';
          case PageType.router2:
            return 'rabbit-design:icon-router';
          case PageType.component:
            return 'rabbit-design:icon-component';
          default:
            break;
        }
      },
      isLeaf: (item) => item.pageType === PageType.page,
    });
  }
}
