- 构造器注入的服务,变量名为大写
- 原因: 懒得导入服务后还要改名,大部分时候并不需要,并且不会报错
```typescript
    declare class ComponentFactoryResolver{
      resolveComponentFactory: (c)=>{}
    }
    export class Project{
        constructor(public ComponentFactoryResolver: ComponentFactoryResolver) {
        }
        func1(c: any){
          this.ComponentFactoryResolver.resolveComponentFactory(c);
        }
    }
```
