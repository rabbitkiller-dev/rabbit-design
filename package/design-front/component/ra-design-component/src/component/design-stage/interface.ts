import {StageFactory} from './ra-design-stage.service';

/**
 * 舞台栏(默认的数据)
 * stage tab, default data
 */
export interface StageTabModel extends StageTabServerModel, StageTabLocalModel {
  icon: string;
  factory?: StageFactory;
}

/**
 * 舞台栏(服务端来的数据)
 * stage tab, data form server
 */
export interface StageTabServerModel {
  id: string;
  title: string;
}

/**
 * 舞台栏(保存到本地的数据)
 * stage tab, save data in localhost
 */
export interface StageTabLocalModel {
  position?: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom';
  order?: number;
  select?: boolean;
}

/**
 * 舞台栏(保存到本地的数据)
 * stage tab, save data in localhost
 */
export interface StageServiceEvent {
  type: 'open' | 'put';
  data?: StageTabModel;
}
