import {Inject, Injectable, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {KEY_CODE_LIST, KEY_MAP_LIST} from './key-map-list';
import {Subject} from 'rxjs';
import {DesignWindow, KeyMapEvent} from './interface';

/**
 * KeyMap
 * 将会让所有元素增加tabIndex
 * 将会管理注册窗口的聚焦
 */

@Injectable({providedIn: 'root'})
export class RaDesignKeyMapService {
  focus: 'side_bar_key_map' | 'stage_page_editor' | 'dialog' | 'key-map-set' | string = 'stage_page_editor';
  status: 'down' | 'up' | 'none' = 'none';
  history: any[] = [];
  listenerMap: Map<number, Subject<KeyMapEvent>> = new Map();
  private focusDesignWindow: DesignWindow; // 窗口自带的参数
  private _id: number = 0;

  private getID(): number {
    return ++this._id;
  }

  constructor(@Inject(DOCUMENT) document: Document) {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (!this.focus) {
        return;
      }
      this.status = 'down';
      const keyCode = KEY_CODE_LIST[event.keyCode];
      const keyList = KEY_MAP_LIST[this.focus];
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
        const subject = this.listenerMap.get(this.focusDesignWindow.id);
        subject.next({
          emitKey: emitKey,
          event: event,
          option: this.focusDesignWindow.option,
        });
      }
    });
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      this.status = 'up';
    });
    window.addEventListener('click', (event) => {
      const designWindow = this.findElementUp(event);
      if (designWindow) {
        this.focusDesignWindow = designWindow;
        this.focus = designWindow.name;
        this.history.push(designWindow);
      }
    });
  }

  registerListenerWindow(winName: string, element: HTMLElement, option?: any): Subject<KeyMapEvent> {
    // this.Renderer2.addClass(element, 'ra-design-window');
    // this.Renderer2.setProperty(element, 'designWindow', {name: winName});
    const designWindow: DesignWindow = {id: this.getID(), name: winName, option: option};
    element.classList.add('ra-design-window');
    element['designWindow'] = designWindow;
    const subject = new Subject<KeyMapEvent>();
    this.listenerMap.set(designWindow.id, subject);
    return subject;
  }

  /** Find element up */
  findElementUp(eventTarget: MouseEvent | TouchEvent): DesignWindow {
    let currentElement: HTMLElement = eventTarget.target as HTMLElement;
    do {
      if (currentElement.classList.contains('ra-design-window')) {
        return currentElement['designWindow'];
      }
      currentElement = currentElement.parentElement;
    } while (currentElement);
    return null;
  }

  focusWindow(winName: string) {

  }

  blurWindow(winName: string) {

  }

}
