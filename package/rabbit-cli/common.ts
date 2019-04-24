import * as fs from 'fs';
import * as path from 'path';

export class Common {
  config: {
    i18n: { source: string[] | string, target },
  };

  constructor(mode, option) {
    if (fs.existsSync(path.join(process.cwd(), 'rabbit.json'))) {
      this.config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'rabbit.json')).toString());
    } else {
      console.log('没有配置文件(rabbit.json');
    }
  }

  root(...str): string {
    return path.join(process.cwd(), ...str);
  }
}

