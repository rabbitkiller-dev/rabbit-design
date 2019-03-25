import {HtmlJson} from 'himalaya';

const DirectiveNames = ['nz-icon', 'nz-input'];

export function parserDirective(htmlJson: HtmlJson): string[] {
  const result = [];
  htmlJson.attributes.forEach((attr) => {
    if (DirectiveNames.indexOf(attr.key) !== -1) {
      result.push(attr.key);
    }
  });
  return result;
}
