import {Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';

/**
 * @table 基础
 * @author rabbit
 */
export abstract class Base {

  @Column()
  author: string; // 创作者 @User.userID

  @Column('tinyint', {default: 1})
  enable: boolean; // 是否启用

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  modifyTime: Date;
}
