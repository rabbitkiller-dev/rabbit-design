import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {Base} from './base';

/**
 * @table 图标
 * @author rabbit
 */
@Entity()
export class Icon extends Base {

  @PrimaryGeneratedColumn('uuid')
  iconID: string; // 图标ID

  @Column()
  projectID: string; // 项目ID @Project

  @Column()
  fontClass: string; // 字体类名称

  @Column('longtext')
  svg: string; // svg图标

}
