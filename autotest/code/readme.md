### Environment Setup
1. system: Windows11
2. DevTools: Windows 64

### Dependencies:   
1. install node;
2. install miniprogram-automator, execute the following command directly:
```
npm i miniprogram-automator --save-dev
```

### Usage
1. install DevTools Windows 64
2. create a mini program project
3. create a page named AutoTest
4. Overwrite the app.json in the project with the app.json in the code
5. modify cliPath and projectPath to your path
6. chose aototest debug port(when test real machine):
```
<F:/tool/Tencent/devtoos1.06.2410222/cli> --auto <F:/WeChatProjects/alltest> --auto-port 9420
```
7. run chode:
```
node .\auto.spec.js
```
### Change configuration or platform
Change the configuration by modifying app.json
1. Webview + exparser: use app.json

2. Webview + glass-easel, Add the following code to app.json:
```
"componentFramework": "glass-easel",
  "lazyCodeLoading": "requiredComponents"
```

4. Skyline + glass-easel, Add the following code to app.json:
```
  "renderer": "skyline",
  "rendererOptions": {
    "skyline": {
      "defaultDisplayBlock": true,
      "defaultContentBox":true,
      "disableABTest": true,
      "sdkVersionBegin": "3.0.0",
      "sdkVersionEnd": "15.255.255"
    }
  },
  "componentFramework": "glass-easel",
  "lazyCodeLoading": "requiredComponents"
```
Change platform by modifying link mode
1. await miniProgram.remote() => await miniProgram.remote(true)
2. When linking the real machine, you need to configure development tools to automatically link the real machine for debugging
