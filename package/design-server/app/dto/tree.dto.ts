export interface TreeDto {
  key?: string;
  parentKey?: string;
  title?: string;
  icon?: string;
  children?: any[];
  expanded?: boolean;
  leaf?: boolean;
}
