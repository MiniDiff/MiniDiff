import os
import shutil
import argparse
import time
import tkinter as tk
import difflib
from pathlib import Path

import pyautogui

import data_types as DataType
import make_file


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
        except OSError as error:
            print(f"复制失败: {error}")
            return False

    def move_file(self, source, destination):
        """移动文件"""
        try:
            shutil.move(source, destination)
            print(f"文件已移动: {source} -> {destination}")
            return True
        except OSError as error:
            print(f"移动失败: {error}")
            return False

    def click_left(self, x, y, clicks=1, button='left'):
        """点击指定位置"""
        try:
            pyautogui.click(x=x, y=y, clicks=clicks, button=button)
            print(f"已点击位置: ({x}, {y})")
            return True
        except (pyautogui.PyAutoGUIException, ValueError) as error:
            print(f"点击失败: {error}")
            return False

    def click_right(self, x, y, clicks=1, button='right'):
        """点击指定位置"""
        try:
            pyautogui.click(x=x, y=y, clicks=clicks, button=button)
            print(f"已点击位置: ({x}, {y})")
            return True
        except (pyautogui.PyAutoGUIException, ValueError) as error:
            print(f"点击失败: {error}")
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
PLATFORM = "DevTools"
CONF = "normal"
SUPPERAPP = "0"  # 0 for Alipay , 1 for TikTok
PROJECT_PATH = None
CODE_PATH = None
RESULT_PATH = '../AutoTestResult/'


def configure_from_args(argv=None):
    global PLATFORM, CONF, SUPPERAPP, PROJECT_PATH, RESULT_PATH, CODE_PATH

    parser = argparse.ArgumentParser(
        description="Generate, execute, and analyze mini-program auto tests."
    )
    parser.add_argument(
        "--platform", default=PLATFORM,
        help="Target platform, e.g. DevTools, AndroidVM, Windows, IOS, Mac."
    )
    parser.add_argument("--conf", default=CONF, help="Runtime config, e.g. normal, native.")
    parser.add_argument(
        "--supperapp", default=SUPPERAPP,
        help="Target supperapp, e.g. 0 for Alipay , 1 for TikTok"
    )
    parser.add_argument(
        "--project-path", required=True,
        help="Mini-program page directory used by Executor."
    )
    parser.add_argument(
        "--result-path", default=RESULT_PATH,
        help="Directory for generated cases and collected results."
    )
    args = parser.parse_args(argv)

    PLATFORM = args.platform
    CONF = args.conf
    SUPPERAPP = args.supperapp
    PROJECT_PATH = args.project_path
    CODE_PATH = os.path.join(PROJECT_PATH, 'pages/index')
    RESULT_PATH = args.result_path
    return args


def save_file(filename, content):
    try:
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"文件已写入: {filename}")
    except OSError as error:
        print(f"写入文件失败: {error}")


def generator(result_root):
    # Generate every test case directory and write index.axml/index.js/index.sjs.
    all_data_types = DataType.DATA_TYPES
    operators = DataType.OPERATORS
    root_path = Path(result_root)
    root_path.mkdir(parents=True, exist_ok=True)

    for modul1 in range(2):
        for modul2 in range(3):
            for modul3 in range(3):
                for modul4 in range(3):
                    for dt_num in range(len(all_data_types) - 1, -1, -1):
                        for api_num in range(0, -1, -1):
                            for oper_num in range(len(operators) - 1, -1, -1):
                                case_name = (
                                    "A"
                                    + str(modul1)
                                    + str(modul2)
                                    + str(modul3)
                                    + str(modul4)
                                    + all_data_types[dt_num][0]
                                    + str(api_num)
                                    + str(oper_num)
                                )
                                case_path = root_path / case_name
                                case_path.mkdir(parents=True, exist_ok=True)

                                type_num = make_file.make_wxml_file(
                                    modul1,
                                    modul2,
                                    modul3,
                                    modul4,
                                    all_data_types[dt_num],
                                    all_data_types[dt_num][2][api_num],
                                    operators[oper_num],
                                    case_path,
                                    SUPPERAPP
                                )
                                make_file.make_js_file(
                                    all_data_types[dt_num], type_num, case_path, SUPPERAPP
                                )
                                make_file.make_wxs_file(
                                    all_data_types[dt_num], type_num, case_path, SUPPERAPP
                                )

                                if modul3 == 0:
                                    break

    print("Generator OK")
    return


def executor(result_root):
    # 通过根目录获得全部代码

    # 运行，收集数据
    # 结果保存目录:result_root/Dir/platform
    # 点击编译，等待
    def click_compile():
        if PLATFORM == "DevTools":
            manager.click_left(260, 105)
        else:
            # manager.click_left(260, 105)
            # time.sleep(2)
            manager.click_left(1540, 40)  # 点击屏幕坐标(500,300)
            time.sleep(10)
        return

    # 复制html
    def save_html(to_path):
        if PLATFORM == "DevTools":
            # 点element，右键page，移到copy，点击copy outeraxml
            manager.click_left(690, 135)
            manager.click_right(690, 165)
            manager.click_left(750, 235)
            manager.click_left(930, 235)
        else:
            manager.click_left(530, 165)
            manager.click_right(530, 195)
            manager.click_left(580, 265)
            manager.click_left(750, 265)
        # 获取粘贴板数据，写入文件
        try:
            xml_text = tk.Tk().clipboard_get()
        except tk.TclError:
            print("剪贴板为空或包含非文本内容")
            return 0
        except UnicodeError as error:
            print(f"获取剪贴板失败: {error}")
            return 0
        # 保存到文件
        save_file(to_path, xml_text)
        return 1

    # 复制log
    def save_log(to_path):
        flag = 1
        if PLATFORM == "DevTools":
            # 点console，右键最后一行，点c+a，c+c
            manager.click_left(770, 135)
            manager.click_left(770, 190)
        else:
            manager.click_left(600, 165)
            manager.click_left(600, 241)
        pyautogui.hotkey('ctrl', 'a')
        pyautogui.hotkey('ctrl', 'c')
        # 获取粘贴板数据，写入文件
        try:
            xml_text = tk.Tk().clipboard_get()
        except tk.TclError:
            print("剪贴板为空或包含非文本内容")
            xml_text = ''
            flag = 0
        except UnicodeError as error:
            print(f"获取剪贴板失败: {error}")
            xml_text = ''
            flag = 0

        if PLATFORM == "DevTools":
            manager.click_left(641, 167)
        else:
            manager.click_left(502, 196)  # 清空log
            manager.click_left(1478, 136)  # 关闭调试窗口
            manager.click_left(408, 312)  # 手机界面断开调试
            manager.click_left(261, 572)  # 手机界面关闭调试
            manager.click_left(1565, 380)  # 断开调试

        # 保存到文件
        save_file(to_path, xml_text)
        return flag

    def run_get_res(full_path):
        to_path = os.path.join(full_path, PLATFORM)
        if to_path and not os.path.exists(to_path):
            try:
                os.makedirs(to_path, exist_ok=True)
                print(f"创建目录: {to_path}")
            except OSError as error:
                print(f"创建目录失败: {error}")
                return False
        to_path = os.path.join(full_path, PLATFORM, CONF)
        if to_path and not os.path.exists(to_path):
            try:
                os.makedirs(to_path, exist_ok=True)
                print(f"创建目录: {to_path}")
            except OSError as error:
                print(f"创建目录失败: {error}")
                return False

        flag = 0
        while flag == 0:
            click_compile()
            time.sleep(2)
            flag1 = save_html(os.path.join(to_path, "index.html"))
            flag2 = save_log(os.path.join(to_path, "log.txt"))
            flag = flag1 * flag2
            time.sleep(1)
        return

    print("Executor Begin")
    suffix = ".axml" if SUPPERAPP else ".ttml"
    # 将app.json复制到目标项目中
    if SUPPERAPP == 0:
        if CONF == "normal":
            manager.copy_file('AlipayT/app.json', os.path.join(PROJECT_PATH, 'app.json'))
        else:
            manager.copy_file('AlipayT/Napp.json', os.path.join(PROJECT_PATH, 'app.json'))
    try:
        for root, dirs, _ in os.walk(result_root):
            for dir_name in dirs:
                full_path = os.path.join(root, dir_name)
                xml_path = os.path.join(full_path, "index" + suffix)
                sjs_path = os.path.join(full_path, "index.sjs")
                js_path = os.path.join(full_path, "index.js")
                # 将代码复制到测试项目代码中
                print(f"{os.path.join(CODE_PATH, 'index' + suffix)}")
                manager.copy_file(xml_path, os.path.join(CODE_PATH, "index" + suffix))
                manager.copy_file(sjs_path, os.path.join(CODE_PATH, 'index.sjs'))
                manager.copy_file(js_path, os.path.join(CODE_PATH, 'index.js'))
                time.sleep(2)
                run_get_res(full_path)
            break

    except OSError as error:
        print(f"遍历错误: {error}")
        return []
    # 下一个
    print("Executor End")
    return


def analyzer(result_root):
    def compare_list(data_list):
        temp_string = ''
        total = 0
        count = 0
        for data_string in data_list:
            if temp_string == '':
                temp_string = data_string
            else:
                total += difflib.SequenceMatcher(None, temp_string, data_string).ratio()
                count += 1
        if count == 0:
            return 0
        return total / count

    # 通过根目录获得结果列表
    html_different = []
    log_different = []
    all_different = []
    print("Analyzer Begin")
    try:
        for root, dirs, _ in os.walk(result_root):
            for dir_name in dirs:  # 测试代码列表
                html_data = []
                log_data = []
                full_path = os.path.join(root, dir_name)
                for r1, platforms, _ in os.walk(full_path):
                    for platform_name in platforms:  # 平台列表
                        p_path = os.path.join(r1, platform_name)
                        for r2, confs, _ in os.walk(p_path):
                            for conf_name in confs:  # 配置列表
                                if conf_name == 'normal':
                                    c_path = os.path.join(r2, conf_name)
                                    html_path = os.path.join(c_path, "index.html")
                                    log_path = os.path.join(c_path, "log.txt")
                                    with open(html_path, 'r', encoding='utf-8') as file:
                                        content = file.read()
                                        html_data.append(content)
                                    with open(log_path, 'r', encoding='utf-8') as file:
                                        content = file.read()
                                        log_data.append(content)
                            break
                    break
                flag = 0
                html_ratio = compare_list(html_data)
                if html_ratio < 1.0:
                    html_different.append(dir_name + ':' + str(html_ratio))
                    flag += 1
                log_ratio = compare_list(log_data)
                if log_ratio < 1.0:
                    log_different.append(dir_name + ':' + str(log_ratio))
                    flag += 1
                if flag == 2:
                    avg_ratio = (html_ratio + log_ratio) / 2
                    all_different.append(dir_name + ':' + str(avg_ratio))

            break

    except OSError as error:
        print(f"遍历错误: {error}")
        return []
    # html对比
    # log对比

    save_file(os.path.join(result_root, 'ResultHTMLDifferentNor.txt'), '\n'.join(html_different))
    save_file(os.path.join(result_root, 'ResultLOGdifferentNor.txt'), '\n'.join(log_different))
    save_file(os.path.join(result_root, 'ResultALLdifferentNor.txt'), '\n'.join(all_different))
    return


# 使用示例
if __name__ == "__main__":
    configure_from_args()
    print("BEGIN")
    # 代码生成模块
    generator(RESULT_PATH)
    # 代码执行模块
    executor(RESULT_PATH)
    # 分析模块
    analyzer(RESULT_PATH)
    # 或者执行整个工作流程
    # manager.automated_workflow()
