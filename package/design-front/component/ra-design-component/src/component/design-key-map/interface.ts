export interface DesignWindow {
  id: number;
  name: any;
  option?: any;
}

export interface KeyMapEvent {
  emitKey: string;
  event: KeyboardEvent;
  option?: any;
}
