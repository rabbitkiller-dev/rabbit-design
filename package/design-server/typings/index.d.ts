import 'egg';
// 扩展 app
import {Connection, ConnectionOptions} from 'typeorm';

declare module 'egg' {
  interface Context {
    body: {
      success: boolean,
      data: any,
      code?: string,
    } | string;
    session: {
      token: string,
    };
  }

  // interface Icon
  interface Application {
    typeorm: Connection;
  }

  // 扩展你的配置
  interface EggAppConfig {
    typeorm: ConnectionOptions;
    apiPrefix: string;
    user: {
      userID: string,
      projectID: string,
    };
  }
}
