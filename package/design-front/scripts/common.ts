import * as fs from 'fs';
import * as path from 'path';

export class Common {
  config: {
    i18nPaths: string[],
  };

  constructor(mode, option) {
    console.log(mode);
    console.log(option.watch);
    if (fs.existsSync(path.join(process.cwd(), 'rabbit.json'))) {
      this.config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'rabbit.json')).toString());
    }
  }
}

