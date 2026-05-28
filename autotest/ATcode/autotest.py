import os
import shutil
import argparse
import pyautogui
import time
import tkinter as tk
import difflib
from pathlib import Path

import DataTypes as DataType
import MakeFile

class FileManager:
    def __init__(self):
        # 初始化，确保pyautogui安全
        pyautogui.FAILSAFE = True
        pyautogui.PAUSE = 1.0  # 每个操作间隔1秒
    
    def copy_file(self, source, destination):
        """复制文件"""
        try:
            shutil.copy2(source, destination)
            print(f"文件已复制: {source} -> {destination}")
            return True
        except Exception as e:
            print(f"复制失败: {e}")
            return False
    
    def move_file(self, source, destination):
        """移动文件"""
        try:
            shutil.move(source, destination)
            print(f"文件已移动: {source} -> {destination}")
            return True
        except Exception as e:
            print(f"移动失败: {e}")
            return False
    
    def click_left(self, x, y, clicks=1, button='left'):
        """点击指定位置"""
        try:
            pyautogui.click(x=x, y=y, clicks=clicks, button=button)
            print(f"已点击位置: ({x}, {y})")
            return True
        except Exception as e:
            print(f"点击失败: {e}")
            return False
        
    def click_right(self, x, y, clicks=1, button='right'):
        """点击指定位置"""
        try:
            pyautogui.click(x=x, y=y, clicks=clicks, button=button)
            print(f"已点击位置: ({x}, {y})")
            return True
        except Exception as e:
            print(f"点击失败: {e}")
            return False
        
    def automated_workflow(self):
        """自动化工作流程示例"""
        # 1. 复制文件
        self.copy_file('source.txt', 'backup/source_backup.txt')
        
        # 2. 等待一下
        time.sleep(2)
        
        # 3. 点击某个固定位置（比如确认按钮）
        self.click_position(100, 200)
        
        # 4. 移动文件
        self.move_file('source.txt', 'archive/source.txt')
        
        # 5. 再次点击
        self.click_position(300, 400)

manager = FileManager()
platform = "DevTools"
conf = "normal"
supperapp = "0" # 0 for Alipay , 1 for TikTok
projectPath = None
codePath = None
ResultPath = '../AutoTestResult/'


def ConfigureFromArgs(argv=None):
    global platform, conf, supperapp, projectPath, ResultPath, codePath

    parser = argparse.ArgumentParser(description="Generate, execute, and analyze mini-program auto tests.")
    parser.add_argument("--platform", default=platform, help="Target platform, e.g. DevTools, AndroidVM, Windows, IOS, Mac.")
    parser.add_argument("--conf", default=conf, help="Runtime config, e.g. normal, native.")
    parser.add_argument("--supperapp", default=supperapp, help="Target supperapp, e.g. 0 for Alipay , 1 for TikTok")
    parser.add_argument("--project-path", required=True, help="Mini-program page directory used by Executor.")
    parser.add_argument("--result-path", default=ResultPath, help="Directory for generated cases and collected results.")
    args = parser.parse_args(argv)

    platform = args.platform
    conf = args.conf
    supperapp = args.supperapp
    projectPath = args.project_path
    codePath = os.path.join(projectPath, 'pages/index')
    ResultPath = args.result_path
    return args

def SaveFile(filename, content):
    try:
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"文件已写入: {filename}")
    except Exception as e:
        print(f"写入文件失败: {e}")

def Generator(RootPath):
    # Generate every test case directory and write index.axml/index.js/index.sjs.
    data_types = DataType.DataTypes
    operators = DataType.operators
    root_path = Path(RootPath)
    root_path.mkdir(parents=True, exist_ok=True)

    for modul1 in range(2):
        for modul2 in range(3):
            for modul3 in range(3):
                for modul4 in range(3):
                    for dt_num in range(len(data_types) - 1, -1, -1):
                        for api_num in range(0, -1, -1):
                            for oper_num in range(len(operators) - 1, -1, -1):
                                case_name = (
                                    "A"
                                    + str(modul1)
                                    + str(modul2)
                                    + str(modul3)
                                    + str(modul4)
                                    + data_types[dt_num][0]
                                    + str(api_num)
                                    + str(oper_num)
                                )
                                case_path = root_path / case_name
                                case_path.mkdir(parents=True, exist_ok=True)

                                type_num = MakeFile.MakeWXMLFile(
                                    modul1,
                                    modul2,
                                    modul3,
                                    modul4,
                                    data_types[dt_num],
                                    data_types[dt_num][2][api_num],
                                    operators[oper_num],
                                    case_path,
                                    supperapp
                                )
                                MakeFile.MakeJSFile(data_types[dt_num], type_num, case_path, supperapp)
                                MakeFile.MakeWXSFile(data_types[dt_num], type_num, case_path, supperapp)

                                if modul3 == 0:
                                    break

    print("Generator OK")
    return

def Executor(RootPath):
    #通过根目录获得全部代码
    
    #运行，收集数据
    #结果保存目录:RootPath/Dir/platform
    #点击编译，等待
    def ClickCompile():
        if platform == "DevTools":
            manager.click_left(260, 105)
        else:
            #manager.click_left(260, 105)
            #time.sleep(2)
            manager.click_left(1540, 40)  # 点击屏幕坐标(500,300)
            time.sleep(10)
        return
    
    #复制html
    def SaveHTML(ToPath):
        if platform == "DevTools":
        #点element，右键page，移到copy，点击copy outeraxml
            manager.click_left(690, 135)
            manager.click_right(690, 165)
            manager.click_left(750, 235)
            manager.click_left(930, 235)
        else:
            manager.click_left(530, 165)
            manager.click_right(530, 195)
            manager.click_left(580, 265)
            manager.click_left(750, 265)
        #获取粘贴板数据，写入文件
        try:
            XML_text = tk.Tk().clipboard_get()
        except tk.TclError:
            print("剪贴板为空或包含非文本内容")
            return 0
        except Exception as e:
            print(f"获取剪贴板失败: {e}")
            return 0
        #保存到文件
        SaveFile(ToPath,XML_text)
        return 1
    
    #复制log
    def SaveLog(ToPath):
        flag = 1
        if platform == "DevTools":
        #点console，右键最后一行，点c+a，c+c
            manager.click_left(770, 135)
            manager.click_left(770, 190)
        else:
            manager.click_left(600, 165)
            manager.click_left(600, 241)
        pyautogui.hotkey('ctrl', 'a')
        pyautogui.hotkey('ctrl', 'c')
        #获取粘贴板数据，写入文件
        try:
            XML_text = tk.Tk().clipboard_get()
        except tk.TclError:
            print("剪贴板为空或包含非文本内容")
            XML_text = ''
            flag = 0
        except Exception as e:
            print(f"获取剪贴板失败: {e}")
            XML_text = ''
            flag = 0
        
        if platform == "DevTools":
            manager.click_left(641, 167)
        else:
            manager.click_left(502, 196)#清空log
            manager.click_left(1478,136)#关闭调试窗口
            manager.click_left(408,312)#手机界面断开调试
            manager.click_left(261,572)#手机界面关闭调试
            manager.click_left(1565,380)#断开调试
            

        #保存到文件
        SaveFile(ToPath,XML_text)
        return flag
    
    def RunGetRes(full_path):
        ToPath = os.path.join(full_path, platform)
        if ToPath and not os.path.exists(ToPath):
            try:
                os.makedirs(ToPath, exist_ok=True)
                print(f"创建目录: {ToPath}")
            except OSError as e:
                print(f"创建目录失败: {e}")
                return False
        ToPath = os.path.join(full_path, platform, conf)
        if ToPath and not os.path.exists(ToPath):
            try:
                os.makedirs(ToPath, exist_ok=True)
                print(f"创建目录: {ToPath}")
            except OSError as e:
                print(f"创建目录失败: {e}")
                return False
        
        flag = 0
        while flag == 0 :
            ClickCompile()
            time.sleep(2)
            flag1 = SaveHTML(os.path.join(ToPath, "index.html"))
            flag2 = SaveLog(os.path.join(ToPath, "log.txt"))
            flag = flag1 * flag2
            time.sleep(1)
        return
    
    all_files = []
    print("Executor Begin")
    suffix = ".axml" if supperapp else ".ttml"
    #将app.json复制到目标项目中
    if supperapp == 0 :
        if conf == "normal":
            manager.copy_file('AlipayT/app.json', os.path.join(projectPath,'app.json'))
        else:
            manager.copy_file('AlipayT/Napp.json', os.path.join(projectPath,'app.json'))
    try:
        for root, dirs, files in os.walk(RootPath):
            for dir in dirs:
                full_path = os.path.join(root, dir)
                XML = os.path.join(full_path, "index" + suffix)
                SJS = os.path.join(full_path, "index.sjs")
                JS = os.path.join(full_path, "index.js")
                #将代码复制到测试项目代码中
                print(f"{os.path.join(codePath,"index" + suffix)}")
                manager.copy_file(XML, os.path.join(codePath,"index" + suffix))
                manager.copy_file(SJS, os.path.join(codePath,'index.sjs'))
                manager.copy_file(JS, os.path.join(codePath,'index.js'))
                time.sleep(2)
                RunGetRes(full_path) 
            break

    except Exception as e:
        print(f"遍历错误: {e}")
        return []
    #下一个
    print("Executor End")
    return

def Analyzer(RootPath):
    def CompareList(list):
        TemString = ''
        sum = 0
        count = 0
        for dataString in list:
            if TemString == '' :
                TemString = dataString
            else:
                sum += difflib.SequenceMatcher(None, TemString, dataString).ratio()
                count += 1
        if count == 0:
            return 0
        else:
            return sum/count
    #通过根目录获得结果列表
    HTMLdifferent = []
    LOGdifferent = []
    ALLdifferent = []
    print("Analyzer Begin")
    try:
        for root, dirs, files in os.walk(RootPath):
            for dir in dirs:#测试代码列表
                HTMLdata = []
                LOGdata = []
                full_path = os.path.join(root, dir)
                for r1, platforms, fs in os.walk(full_path):
                    for p in platforms:#平台列表
                        p_path = os.path.join(r1, p)
                        for r2, confs, fs in os.walk(p_path):
                            for c in confs:#配置列表
                                if c == 'normal':
                                    c_path = os.path.join(r2, c)
                                    HTML = os.path.join(c_path, "index.html")
                                    LOG = os.path.join(c_path, "log.txt")
                                    with open(HTML, 'r', encoding='utf-8') as file:
                                        content = file.read()
                                        HTMLdata.append(content)
                                    with open(LOG, 'r', encoding='utf-8') as file:
                                        content = file.read()
                                        LOGdata.append(content)
                            break
                    break
                flag = 0
                a = CompareList(HTMLdata)
                if  a < 1.0 :
                    HTMLdifferent.append(dir + ':' + str(a))
                    flag += 1
                b = CompareList(LOGdata)
                if  b < 1.0 :
                    LOGdifferent.append(dir + ':' + str(b))
                    flag += 1
                if flag == 2 :
                    c = (a+b)/2
                    ALLdifferent.append(dir + ':' + str(c))
                
            break        

    except Exception as e:
        print(f"遍历错误: {e}")
        return []
    #html对比
    #log对比

    SaveFile(os.path.join(RootPath,'ResultHTMLDifferentNor.txt'),'\n'.join(HTMLdifferent))
    SaveFile(os.path.join(RootPath,'ResultLOGdifferentNor.txt'),'\n'.join(LOGdifferent))
    SaveFile(os.path.join(RootPath,'ResultALLdifferentNor.txt'),'\n'.join(ALLdifferent))
    return
# 使用示例
if __name__ == "__main__":
    ConfigureFromArgs()
    print("BEGIN")
    #代码生成模块
    Generator(ResultPath)
    #代码执行模块
    Executor(ResultPath)
    #分析模块
    Analyzer(ResultPath)
    # 或者执行整个工作流程
    # manager.automated_workflow()
