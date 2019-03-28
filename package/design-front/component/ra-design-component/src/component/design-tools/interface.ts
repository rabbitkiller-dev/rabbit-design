import {ToolsFactory} from './ra-design-tools.service';

export interface ToolsTabModel extends ToolsTabLocalModel {
  factory: ToolsFactory;
  label: string;
  icon: string;
}

export interface ToolsTabLocalModel {
  position?: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom';
  order?: number;
  select?: boolean;
  minHeight?: number;
}

export type StoreSideBarLocalModel = {
  [index in ToolsFactory]: ToolsTabLocalModel;
};

export interface SideBarServiceEvent {
  type: 'review';
  data?: any;
}

export interface RaShowInterface {
  raShowInterface();
}
export interface RaHiddenInterface {
  raHiddenInterface();
}
