import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn('uuid')
  userID: string;

  @Column({nullable: true})
  photo: string;

  @Column()
  name: string;

  @Column({nullable: true})
  password: string; // 项目名称

  @Column({nullable: true})
  email: string;

  @Column('tinyint')
  enable: boolean; // 是否有效

}
