import {Column, Entity} from 'typeorm';
import {Page} from './page';

/**
 * @table 页面信息
 * @author rabbit
 */
@Entity()
export class PageInfo extends Page {
  @Column('json', {nullable: true})
  content: string; // 项目ID @Project
}
