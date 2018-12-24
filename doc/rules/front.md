- 构造器注入的服务,变量名为大写 (懒得导入服务后还要改名,大部分时候并不需要)
```
  constructor(public ComponentFactoryResolver: ComponentFactoryResolver) {
  }
  func1(c: any){
    this.ComponentFactoryResolver.resolveComponentFactory(c);
  }
```
