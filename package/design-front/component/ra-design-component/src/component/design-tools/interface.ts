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
}
