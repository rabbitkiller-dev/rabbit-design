export class DesignMenuModel {
  key?: string;
  label?: string;
  shortcut?: string; // 快捷键
  icon?: string; // 图标
  items?: Array<DesignMenuModel>;
}
