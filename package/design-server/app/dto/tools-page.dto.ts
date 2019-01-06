import {Page} from '../entity/page';
import {Project} from '../entity/project';
import {TreeDto} from './tree.dto';

export interface QueryToolsPageTreeDto extends Project, TreeDto {
  children?: QueryToolsPageTreeNodeDto[];
}

export interface QueryToolsPageTreeNodeDto extends Page, TreeDto {

}
