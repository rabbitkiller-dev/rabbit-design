import {Column, Entity, PrimaryColumn} from 'typeorm';

export enum PageType {
  dir = 'dir',
  page = 'page',
  router2 = 'router2',
  component = 'component',
}

/**
 * @table 页面
 * @author rabbit
 */
@Entity()
export class Page {

  @PrimaryColumn()
  pageID: string; // 页面ID

  @Column()
  projectID: string; // 项目ID @Project

  @Column()
  pageName: string; // 页面名称

  @Column({nullable: true})
  pageDesc: string; // 页面描述

  @Column()
  pageType: PageType; // 页面类型

  @Column()
  parentPageID: string; // 父页面ID

  @Column()
  pagePath: string; // 页面ID路径

  @Column()
  author: string; // 创作者 @User.userID

  @Column('tinyint')
  enable: boolean; // 是否启用

}
