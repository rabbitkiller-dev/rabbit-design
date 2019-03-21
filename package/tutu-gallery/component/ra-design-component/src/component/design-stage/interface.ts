import {StageFactory} from './ra-design-stage.service';

export interface StageTabModel extends StageTabServerModel, StageTabLocalModel {
  factory: StageFactory;
  icon: string;
}
export interface StageTabServerModel {
  id: string;
  title: string;
}
export interface StageTabLocalModel {
  position?: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom';
  order?: number;
  select?: boolean;
}
