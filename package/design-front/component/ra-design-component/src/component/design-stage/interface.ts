import {StageFactory} from './ra-design-stage.service';

export interface StageTabModel extends StageTabServerModel, StageTabLocalModel {
  icon: string;
  factory?: StageFactory;
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

export interface StageServiceEvent {
  type: 'open';
  data?: StageTabModel;
}
