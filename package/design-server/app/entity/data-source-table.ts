import {Column, Entity, OrderByCondition, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class DataSourceTable {

  @PrimaryGeneratedColumn('uuid')
  tableID: string;

  @Column()
  connectionID: string; // 连接ID

  @Column()
  branchName: string; // 分支名称

  @Column()
  projectID: string; // 项目ID

  @Column()
  tableName: string; // 表名

  @Column({nullable: true})
  tableDescription: string; // 描述

  @Column('json', {nullable: true})
  orderBy: OrderByCondition; // 排序字段

  @Column({nullable: true})
  engine: string; // 数据库引擎

  @Column({nullable: true})
  database: string; // 数据库名称

  @Column({nullable: true})
  schema: string; // 是否启用

  @Column({type: 'tinyint', nullable: true})
  synchronize: boolean; // 开启同步

  @Column('tinyint')
  enable: boolean; // 是否启用

}
