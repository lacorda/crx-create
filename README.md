# crx-template

![crx](http://image.liuxianan.com/201706/20170619_114836_364_3616.png)

基于react+vite搭建的多chrome插件开发模板


## 项目结构

```
├── README.md 
├── package.json
├── vite.config.ts     // vite配置文件
├── twind.config.ts    // twind配置文件
├── tsconfig.json      // ts配置文件
├── manifest.ts        // manifest配置文件
├── project.config.ts  // 多插件项目配置文件
├── utils              // 构建工具函数
├── test-utils
├── packages           // 多插件项目
├── common             // 公共代码
├── dist               // 输出目录
```

## 插件开发

### 1. 创建插件项目

1. packages添加创建插件的script
   
```json title=packages.json
{
  "build:xxx": "tsc --noEmit && cross-env __PROJECT_NAME__=xxx vite build",
  "dev:xxx": "pnpm reload:hmr && (run-p reload:wss reload:watch:xxx)",
  "reload:watch:xxx": "cross-env __DEV__=true __PROJECT_NAME__=xxx vite build -w --mode development",
}
```

2. 复制_example目录到packages目录下，重命名为插件名


3. 若默认的`manifest.json`配置无法满足需求，可以在 `project.config.ts`文件内补充配置
  
  ```ts title=project.config.ts
  export const projectConfig = {
    xxx: {
      name: 'xxx',
      description: 'xxx',
    },
  }
  ```



