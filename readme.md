MINIDIFF
===
This repo is for "Detecting Logic Discrepancies in Cross-Layer Communications within the Mini-Program Framework"

Discrepancies Example
----
The folder **Discrepancies** contains the examples of Discrepancies codes  
The directory structure of the **Discrepancies Example** is as follows:
```
Discrepancies/  
├── WeChat/                # WeChat Mini-Program Discrepancies    
├── ── C1-C20,P1-P8        # All sample codes  
├── ── readme.md           # Introduction and Code snippet links  
├── Alipay/                # Alipay Mini-Program Discrepancies  
├── ── C21-C27,P9-P11      # sample code  
├── ── readme.md           # Introduction  
├── TikTok/                # TikTok Mini-Program Discrepancies  
├── ── P12-P18             # All sample codes  
└── ── readme.md           # Introduction 
```

autotest
----
The folder **autotest** contains the  MiniDiff code  
The directory structure of the **MiniDiff** project is as follows:
```
autotest/
├── code/                  # main code  
├── ── readme.md/          # Introduction  
├── ── auto.spec.js        # main code, generate code and run Wechat test case.  
├── ── auto.spec-gen.js    # generator code, part of main code.  
├── ── AlipayT/            # template for Alipay.  
├── ── TikTokT/            # template for TikTok.  
├── ── WeChatT/            # template for WeChat.  
├── ── index.\*\*ml**      # xml code of template  
├── ── ── index.js**       # rjs code of template  
├── ── ── index.\*\*s**    # rjs code of template  
├── ── ── app.json**       # project config code of template  
└── ATcode/                # Executor for Alipay and TikTok
```

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

