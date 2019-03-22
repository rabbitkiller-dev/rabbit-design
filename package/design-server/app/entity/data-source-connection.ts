import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class DataSourceConnection {

  @PrimaryGeneratedColumn('uuid')
  connectionID: string;

  @Column()
  projectID: string; // 项目ID

  @Column('tinyint')
  enable: boolean; // 是否启用

  @Column()
  connectionName: string;

  @Column()
  type: 'mysql'; // 数据库类型

  @Column()
  host: string; // 主机地址

  @Column('int')
  port: number; // 端口

  @Column()
  username: string; // 用户名

  @Column()
  password: string; // 密码

  @Column()
  database: string; // 数据库名称
}
