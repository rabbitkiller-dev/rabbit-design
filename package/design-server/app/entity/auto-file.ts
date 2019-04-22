import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class AutoFile {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn('int')
  version: number;

  @Column()
  projectId: string; // 项目ID

  @Column()
  fileName: string; // 文件名称

  @Column('tinyint')
  isDirectory: boolean; // 是否是文件夹

  @Column()
  filePath: string; // 全路径

  @Column()
  content: string; // 内容

  @Column('tinyint')
  isMedia: boolean; // 是否是媒体文件

  @Column('json')
  source: {
    name: 'table' | 'page',
    id: string,
    version: number,
  };
}
