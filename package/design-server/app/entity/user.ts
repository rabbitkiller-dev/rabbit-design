import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  userID: string;

  @Column()
  userName: string;

  @Column()
  password: string; // 项目名称

  @Column()
  email: string;

  @Column('tinyint')
  enable: boolean; // 是否有效

}
