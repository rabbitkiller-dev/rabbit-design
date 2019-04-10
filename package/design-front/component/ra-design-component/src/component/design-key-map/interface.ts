import {WINDOW_NAME} from './ra-design-key-map.service';

export interface DesignWindow {
  id: number;
  name: WINDOW_NAME;
  option?: any;
}

export interface KeyMapEvent {
  emitKey: string;
  event: KeyboardEvent;
  option?: any;
}
