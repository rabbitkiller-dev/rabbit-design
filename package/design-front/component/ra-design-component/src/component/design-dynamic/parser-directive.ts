import {HtmlJson} from 'himalaya';

const DirectiveNames = ['nz-icon', 'nz-input'];
const componentName = ['nz-header', 'nz-'];

export function parserDirective(htmlJson: HtmlJson): string[] {
  const result = [];
  htmlJson.attributes.forEach((attr) => {
    if (DirectiveNames.indexOf(attr.key) !== -1) {
      result.push(attr.key);
    }
  });
  if (componentName.indexOf(htmlJson.tagName) !== -1) {
    result.push(htmlJson.tagName);
  }
  return result;
}
