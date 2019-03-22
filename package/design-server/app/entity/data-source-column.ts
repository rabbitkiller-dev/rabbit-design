import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class DataSourceColumn {

  @PrimaryGeneratedColumn('uuid')
  columnID: string;

  @Column()
  projectID: string; // 项目ID

  @Column()
  tableID: string;

  @Column()
  columnName: string; // 列名

  @Column()
  columnDescription: string; // 描述

  @Column()
  type: string;
  // type: ColumnType;

  @Column()
  length: string;

  @Column('int', {nullable: true})
  width?: number;

  @Column('tinyint')
  nullable?: boolean;

  @Column('tinyint', {nullable: true})
  readonly?: boolean;

  @Column('tinyint', {nullable: true})
  select?: boolean;

  @Column('json', {nullable: true})
  default?: any;

  @Column({nullable: true})
  onUpdate?: string;

  @Column('tinyint', {nullable: true})
  primary?: boolean;

  @Column('tinyint', {nullable: true})
  unique?: boolean;

  @Column({nullable: true})
  comment?: string;

  @Column('int', {nullable: true})
  precision?: number | null;

  @Column('int', {nullable: true})
  scale?: number;

  @Column('tinyint', {nullable: true})
  zerofill?: boolean;

  @Column('tinyint', {nullable: true})
  unsigned?: boolean;

  @Column({nullable: true})
  charset?: string;

  @Column({nullable: true})
  collation?: string;

  @Column('json', {nullable: true})
  enum?: any[];

  @Column({nullable: true})
  asExpression?: string;

  @Column({nullable: true})
  generatedType?: 'VIRTUAL' | 'STORED';

  @Column({nullable: true})
  hstoreType?: 'object' | 'string';

  @Column('tinyint', {nullable: true})
  array?: boolean;

  // @Column()
  // transformer?: ValueTransformer;

  @Column('tinyint')
  enable: boolean; // 是否启用
}
