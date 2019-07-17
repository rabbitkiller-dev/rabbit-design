import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('authorization')
export class AuthorizationEntity {

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  provider: string;

  @Column()
  providerUserID: string; // 项目名称

  @Column()
  userID: string;

}
