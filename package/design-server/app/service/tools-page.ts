import {Controller} from 'egg';
import {EntityManager} from 'typeorm';
import {QueryToolsPageTreeDto, QueryToolsPageTreeNodeDto} from '../dto/tools-page.dto';
import {Page} from '../entity/page';
import {Project} from '../entity/project';
import {ErrorService} from '../lib';
import {TreeUtil} from '../lib/web/tree-util';

import uuidv1 from 'uuid/v1';

const user = {
  userID: '1'
}
/**
 * 工具栏-页面管理 Service
 */
export default class ToolsPageService extends Controller {

  public async queryToolsPageTree(entityManager: EntityManager, params: { projectID: string }): Promise<QueryToolsPageTreeDto> {
    const projectRepo = entityManager.getRepository(Project);
    const result: QueryToolsPageTreeDto = TreeUtil.autoSet({
      key: 'projectID',
      title: 'projectName',
    }, await projectRepo.findOne({projectID: params.projectID, enable: true}), {
      icon: 'table',
      expanded: true,
      leaf: false,
      parentKey: '-1',
    });

    result.children = TreeUtil.format(TreeUtil.autoSet({
      key: 'pageID',
      title: 'pageName',
      parentKey: 'parentPageID',
    }, await this.queryPageByProject(entityManager, params), {
      icon: () => '',
      expanded: () => '',
      leaf: () => '',
    })) as QueryToolsPageTreeNodeDto[];
    return result;
  }

  public async queryPageByProject(entityManager: EntityManager, params: { projectID: string }): Promise<Page[]> {
    const pageRepo = entityManager.getRepository(Page);
    const result: Page[] = await pageRepo.find({projectID: params.projectID, enable: true});
    return result;
  }

  public async savePage(entityManager: EntityManager, page: Page): Promise<void> {
    const pageRepo = entityManager.getRepository(Page);
    const parentPage: Page | undefined = page.parentPageID ? await pageRepo.findOne({
      pageID: page.parentPageID,
      enable: true,
      projectID: page.projectID,
    }) : undefined;

    if (page.parentPageID && !parentPage) { // 没找到父节点
      ErrorService.RuntimeErrorNotFind();
    } else if (parentPage) {
      page.pageID = uuidv1();
      page.pagePath = `${parentPage.pagePath}/${page.pageID}`;
    } else {
      page.pageID = uuidv1();
      page.pagePath = `${page.pageID}`;
    }
    page.enable = true;
    page.author = user.userID;
    await pageRepo.save(page);
  }

}
