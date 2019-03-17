import {format} from './format';
import lexer from './lexer';
import parser from './parser';
import {toHTML} from './stringify';
import {ParseDefaults, parseDefaults} from './tags';

export function parse(str: string, options: ParseDefaults = parseDefaults) {
  const tokens = lexer(str, options);
  const nodes = parser(tokens, options);
  return format(nodes, options);
}

export function stringify(ast, options: ParseDefaults = parseDefaults) {
  return toHTML(ast, options);
}
