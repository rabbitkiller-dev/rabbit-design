import { TreeNodeModel } from './tree-node.model';

export interface NzFormatEmitEvent {
  eventName: string;
  node: TreeNodeModel;
  event: MouseEvent | DragEvent;
  dragNode?: TreeNodeModel;
  selectedKeys?: TreeNodeModel[];
  checkedKeys?: TreeNodeModel[];
  matchedKeys?: TreeNodeModel[];
  nodes?: TreeNodeModel[];
  keys?: string[];
}

export interface NzFormatBeforeDropEvent {
  dragNode: TreeNodeModel;
  node: TreeNodeModel;
  pos: number;
}
