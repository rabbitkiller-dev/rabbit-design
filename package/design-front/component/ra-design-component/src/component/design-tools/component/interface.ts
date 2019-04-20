import {PageEditorChild} from '../../design-stage/page-editor/page-editor.service';
import {HtmlJson} from 'himalaya';

export interface ComponentInfo {
  getPlaceholder(): HTMLElement;
  createToPage(pageEditor: PageEditorChild): HtmlJson[];
}
