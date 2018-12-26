import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

/**
 * @table 项目
 * @author rabbit
 */
@Entity()
export class Project {

  @PrimaryGeneratedColumn('uuid')
  public projectID: string; // 项目ID

  @Column()
  projectName: string; // 项目名称

  @Column()
  projectDesc: string; // 项目描述

  @Column()
  author: string; // 创作者 @User.userID

  @Column('tinyint')
  enable: boolean; // 是否启用
}
