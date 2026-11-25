### Environment Setup
1. system: Windows 11
2. WeChat Devtools: Windows 64

### Dependencies
1. Install Node.js.
2. From this directory, install the Node dependency:

```
npm install
```

This installs `miniprogram-automator` as declared in `package.json`. Commit
`package-lock.json` to pin the exact version used in the paper.

### Usage
1. install WeChat Devtools Windows 64
2. Create a mini-program project
3. Create a page named `AutoTest`
4. Overwrite the project's `app.json` with the `app.json` provided in this folder
5. Set `cliPath` and `projectPath` to your local paths
6. Choose the autotest debug port when testing on a real device:

```
For Old Version:
<cli_path> --auto <project_path> --auto-port 9420

For Latest Version:
<cli_path> auto --project <project_path> --auto-port 9420
```

7. Run the code:

```
for help:
node .\auto.spec.js --help

run:
node .\auto.spec.js --devtools-cli-path "dev_path" --test-project-path "test_project_path"

parameters:
--result-path default ../AutoTestResult/
--platform default DevTools
--conf default EW
--devtools-cli-path
--test-project-path

for example:
node .\auto.spec.js --devtools-cli-path "F:/tool/Tencent/微信web开发者工具/cli.bat" --test-project-path "F:/WeChatProjects/alltest"
```

### Change configuration or platform

Change configuration by modifying `app.json`:

1. WebView and Exparser: use the provided `app.json`.

2. WebView and GlassEasel: add
```
"componentFramework": "glass-easel",
"lazyCodeLoading": "requiredComponents"
```

3. Skyline and GlassEasel: add
```
"renderer": "skyline",
"rendererOptions": {
  "skyline": {
    "defaultDisplayBlock": true,
    "defaultContentBox": true,
    "disableABTest": true,
    "sdkVersionBegin": "3.0.0",
    "sdkVersionEnd": "15.255.255"
  }
},
"componentFramework": "glass-easel",
"lazyCodeLoading": "requiredComponents"
```

Change running platform by modifying `await miniProgram.remote()` to
`await miniProgram.remote(true)`. Also enable automatic real-device debugging in
WeChat DevTools.
