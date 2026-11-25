### Environment Setup
1. system: Windows 11
2. DevTools: Windows 64

### Dependencies
1. Install Python 3.
2. From this directory, install the third-party dependency:

```
pip install -r requirements.txt
```

Only `pyautogui` is a third-party package. `os`, `shutil`, `time`, `tkinter`
and `difflib` are Python standard-library modules and must not be installed
with pip.

### Usage
1. install DevTools Windows 64
2. Before running, please launch the corresponding DevTool and run a blank mini program
3. Command:

```
run:
python .\autotest.py --project-path "test_project_path"

parameter:
--platform default DevTools
--conf default normal
--supperapp default 0 # 0 for Alipay, 1 for TikTok
--project-path
--result-path default ../AutoTestResult/

for example:
python .\autotest.py --platform DevTools --conf normal --project-path "F:/AliMiniProjects/autotest/" --result-path "../AlipayAutoTestResult"
```

### Change configuration or platform
Modify variable `platform` to specify the running platform.
Modify variable `conf` to specify the running configuration.
You may need to fine tune the click position.
