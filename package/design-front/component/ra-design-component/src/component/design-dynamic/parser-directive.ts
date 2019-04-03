import {HtmlJson} from 'himalaya';

const DirectiveNames = ['nz-icon', 'nz-input'];
const componentName = ['nz-header', 'nz-content', 'nz-footer', 'nz-layout'];
const properties: any = {
  'nz-icon': [{
    key: 'type',
    pipai: ['nzType', 'type', '[nzType]', '[type]'],
    getInstanceKey: ['type'],
    setInstanceKey: ['nzType', 'type'],
  }],
}

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

export function parserDirectiveDetail(htmlJson: HtmlJson): any {
  const result = {};
  const directive = parserDirective(htmlJson);
  directive.map((name) => {
    const propertie = properties[name];
    const attrs = htmlJson.attributes.filter((attr) => {
      if(properties.pipai){

      }
    });
  });
  return result;
}
