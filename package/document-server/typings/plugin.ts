import {Context} from 'egg';
import {UserEntity} from '../app/entity/user.entity';

declare module 'egg' {

  export interface Application {
    passport: EggPassport;
  }

  export interface Context {
    user: UserEntity;
    login(user: UserEntity, options?: {}): void;
    isAuthenticated(): boolean;
  }

  interface EggPassport {
    use(localStrategy: any): void;

    // mount 是语法糖，等价于
    // const github = app.passport.authenticate('github', {});
    // router.get('/passport/github', github);
    // router.get('/passport/github/callback', github);
    mount(name: string, options?: any): void;

    authenticate(strategy: string, options?: EggPassportOptions): any;

    serializeUser(next: (ctx: Context, user: UserEntity) => Promise<{ userID: string, photo: string, name: string }>): void;

    deserializeUser(next: (ctx: Context, user: { userID: string, photo: string, name: string }) => Promise<UserEntity>);
  }

  interface EggPassportOptions {
    successReturnToOrRedirect?: string;
    successRedirect?: string;
    failureRedirect?: string;
  }
}
