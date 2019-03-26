import {Column, Entity, PrimaryColumn} from 'typeorm';
import {Base} from './base';

/**
 * @table 图标
 * @author rabbit
 */
@Entity()
export class Icon extends Base {

  @PrimaryColumn('uuid')
  iconID: string; // 图标ID

  @Column()
  projectID: string; // 项目ID @Project

  @Column()
  fontClass: string; // 字体类名称

  @Column()
  svg: string; // svg图标

}
