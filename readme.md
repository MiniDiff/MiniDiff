# MINIDIFF

Artifact for *"Detecting Logic Discrepancies in Cross-Layer Communications within
Mini-Program Frameworks"* (ICSE 2027).

This repository contains the MINIDIFF testcase generator / executor and minimal
reproductions of the 45 previously unknown logic discrepancies reported in the
paper (28 on WeChat, 10 on Alipay, 7 on TikTok).

## Repository layout

```
Discrepancies/                 # minimal reproductions of the 45 discrepancies
├── WeChat/                    # C1-C20, P1-P8   (28 cases)
├── Alipay/                    # C21-C27, P9-P11 (10 cases)
└── TikTok/                    # P12-P18         (7 cases)
autotest/
├── code/                      # WeChat generator and executor (Node.js)
│   ├── auto.spec.js
│   ├── DataTypes.js  MakeFile.js  ResultCom.js
│   ├── index.wxml  index.wxs  index.js        # page templates
│   ├── app.json  gapp.json  sapp.json         # configuration templates
│   └── readme.md  package.json
└── ATcode/                    # Alipay / TikTok executor (Python)
    ├── AlipayT/  TikTokT/                    # page templates
    ├── autotest.py  auto_spec_gen.py
    ├── data_types.py  make_file.py
    └── readme.md  requirements.txt
.zenodo.json  CITATION.cff  LICENSE  readme.md
```

Each `Discrepancies/<framework>/` folder also contains a `readme.md` describing
the trigger configuration and a link to the corresponding code snippet. Case IDs
are the same as those used in the paper's tables.

## Autotest for WeChat

Code in `autotest/code/`.

### Environment setup
1. OS: Windows 11
2. WeChat DevTools (Windows 64-bit), with the automation port enabled

### Dependencies
Install Node.js, then from `autotest/code/`:

```
npm install
```

This installs `miniprogram-automator` as declared in `package.json`. To pin the
exact version used in the paper, commit `package-lock.json` alongside it.

### Usage
1. Install WeChat DevTools (Windows 64-bit).
2. Create a mini-program project.
3. Create a page named `AutoTest`.
4. Overwrite the project's `app.json` with the `app.json` provided in `code/`.
5. Set `cliPath` and `projectPath` to your local paths.
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
--result-path        default ../AutoTestResult/
--platform           default DevTools
--conf               default EW
--devtools-cli-path  required
--test-project-path  required

example:
node .\auto.spec.js --devtools-cli-path "F:/tool/Tencent/微信web开发者工具/cli.bat" --test-project-path "F:/WeChatProjects/alltest"
```

### Change configuration or platform

Change the configuration by modifying `app.json`:

1. WebView + Exparser: use the provided `app.json`.

2. WebView + GlassEasel: add
```
"componentFramework": "glass-easel",
"lazyCodeLoading": "requiredComponents"
```

3. Skyline + GlassEasel: add
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

To run on a real device, change `await miniProgram.remote()` to
`await miniProgram.remote(true)` and enable automatic real-device debugging in
DevTools.

## Autotest for Alipay and TikTok

Code in `autotest/ATcode/`.

### Environment setup
1. OS: Windows 11
2. Alipay / TikTok DevTools (Windows 64-bit)

### Dependencies
Install Python 3, then from `autotest/ATcode/`:

```
pip install -r requirements.txt
```

Only `pyautogui` is a third-party package. `os`, `shutil`, `time`, `tkinter` and
`difflib` belong to the Python standard library and must not be installed with pip.

### Usage
1. Install DevTools (Windows 64-bit).
2. Launch the corresponding DevTool and run a blank mini program.
3. Run:

```
python .\autotest.py --project-path "test_project_path"

parameters:
--platform       default DevTools
--conf           default normal
--supperapp      default 0   # 0 = Alipay, 1 = TikTok
--project-path
--result-path    default ../AutoTestResult/

example:
python .\autotest.py --platform DevTools --conf normal --project-path "F:/AliMiniProjects/autotest/" --result-path "../AlipayAutoTestResult"
```

Configuration and platform are selected with `platform`, `conf` and `supperapp`;
the click positions may need fine tuning on your machine.

### Change configuration or platform
Modify the variable `platform` to specify the running platform, and `conf` to
specify the rendering configuration. You may need to fine tune the click position.

## Framework versions used in the paper

WeChat v3.4.10, Alipay v2.9.6, TikTok v3.68.0; configurations EW, GW, GS
(WeChat) and WR, NR (Alipay).

## License

The code in this repository is licensed under the MIT License; see
[LICENSE](LICENSE).

## Citation

If you use this artifact, please cite the paper and the archived release. The
Zenodo DOI and the recommended citation will be added here after the v1.0.0
release is published:

```
<Zenodo DOI and recommended citation to be filled in after release>
```
