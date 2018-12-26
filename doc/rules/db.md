- 同一数据库设计时 不是code和name组合  而是name和desc组合
- 原因: 第二种方式只在中国流行,看起来容易,但是coding时不易读, 第一种模式相当于简介
```typescript
  // project true
  export class Project{
    projectID: string;
    projectName: string;  // rabbit-design
    projectDesc: string;  // 兔子设计平台...
  }
  // project false
  export class Project{
    projectID: string;
    projectCode: string; // rabbit-design
    projectName: string; // 兔子设计平台
  }
```
