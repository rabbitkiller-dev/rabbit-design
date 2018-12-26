import {Project} from '../entity/project';
import {TreeDto} from './tree.dto';

export interface QueryToolsPageTreeDto extends Project, TreeDto {
  children:
}

export interface QueryToolsPageTreeNodeDto extends TreeDto {

}


// import {DataSourceColumn} from '../entity/data-source-column';
// import {DataSourceConnection} from '../entity/data-source-connection';
// import {DataSourceTable} from '../entity/data-source-table';
// import {Project} from '../entity/project';
//
// export interface ProjectDataSourceDto extends Project {
//   children: ProjectConnectionDto[];
// }
//
// export interface ProjectConnectionDto extends DataSourceConnection {
//   children: ProjectTableDto[];
// }
//
// export interface ProjectTableDto extends DataSourceTable {
//   children: DataSourceColumn[];
// }
//
// export interface DataSourceTableDto extends DataSourceTable {
//   column: DataSourceColumn[];
// }
