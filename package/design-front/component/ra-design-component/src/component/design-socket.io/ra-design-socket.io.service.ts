import {Injectable} from '@angular/core';
import * as io from '../../../assets/socket.io/socket.io';

@Injectable({providedIn: 'root'})
export class RaDesignSocketIoService {
  constructor() {
    const log = console.log;
    // init
    const socket = io('/', {

      // 实际使用中可以在这里传递参数
      query: {
        room: 'demo',
        userId: `client_${Math.random()}`,
      },

      transports: ['websocket']
    });

    socket.on('connect', () => {
      const id = socket.id;

      log('#connect,', id, socket);

      // 监听自身 id 以实现 p2p 通讯
      socket.on(id, msg => {
        log('#receive,', msg);
      });
    });

    // 接收在线用户信息
    socket.on('online', msg => {
      log('#online,', msg);
    });

    // 系统事件
    socket.on('disconnect', msg => {
      log('#disconnect', msg);
    });

    socket.on('disconnecting', () => {
      log('#disconnecting');
    });

    socket.on('error', () => {
      log('#error');
    });

    window['socket'] = socket;
  }
}
