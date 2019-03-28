import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {KEY_CODE_LIST, KEY_MAP_LIST} from './key-map-list';

@Injectable({providedIn: 'root'})
export class RaDesignKeyMapService {
  current: 'side_bar_key_map' | 'stage_page_editor' | 'dialog' | 'key-map-set' = 'stage_page_editor';
  status: 'down' | 'up' | 'none' = 'none';

  constructor(@Inject(DOCUMENT) document: Document) {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      this.status = 'down';
      const keyCode = KEY_CODE_LIST[event.keyCode];
      const keyList = KEY_MAP_LIST[this.current];
      const ctrlKey = event.ctrlKey;
      const shiftKey = event.shiftKey;
      const altKey = event.altKey;
      let emitKey;
      // 组合键
      if (altKey || ctrlKey) {
        const groupKey = [];
        if (ctrlKey) {
          groupKey.push(KEY_CODE_LIST['17']);
        }
        if (shiftKey) {
          groupKey.push(KEY_CODE_LIST['16']);
        }
        if (altKey) {
          groupKey.push(KEY_CODE_LIST['18']);
        }
        groupKey.push(keyCode);
        const groupKeyCode = groupKey.join('+');
        Object.keys(keyList).forEach((key: string) => {
          const map = keyList[key];
          if (map.key === groupKeyCode) {
            emitKey = key;
          }
        });
      } else {
        Object.keys(keyList).forEach((key: string) => {
          const map = keyList[key];
          if (map.key === keyCode) {
            emitKey = key;
          }
        });
      }
      if (emitKey) {
      }
    });
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      this.status = 'up';
    });
  }

  init(winName: string, element: HTMLElement) {
  }

  listenerWindow() {

  }

  listenerEsc() {

  }
}
