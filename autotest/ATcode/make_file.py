import random
from pathlib import Path

import data_types as DataType


PROJECT_PATH = "F:/WeChatProjects/alltest"

TEMPLATE1 = ["{{a}}{{a}}", "{{a}}{{b}}"]
TEMPLATE2 = ["{{j}}", "{{w}}"]
TEMPLATE3 = ["{{a}}", "{{a a}}", "{{a b}}", "{{a c}}"]
TEMPLATE4 = ["{{F}", "{{f}}", "{{}}"]

DATA_STRING = [""]


def _random_item(values):
    return random.choice(values)


def _read_template(suffix, sa=0):
    tpath = "AlipayT/" if sa else "TikTokT/"
    return Path(tpath + "index" + suffix).read_text(encoding="utf-8")


def _write_file(path, suffix, content):
    Path(path).mkdir(parents=True, exist_ok=True)
    (Path(path) / ("index" + suffix)).write_text(content, encoding="utf-8", newline="")


def make_wxs_file(t_data, type_num, case_path, sa=0):
    suffix = ".sjs"
    try:
        file_string = ""
        data = _read_template(suffix, sa)

        for line in data.splitlines():
            file_string += line + "\r\n"
            if "export default {" in line:
                string1 = ""
                if type_num[1] < 4:
                    string1 = (
                        "\r\n"
                        + "WXSData0:"
                        + _random_item(t_data[1])
                        + ","
                        + "\r\n"
                        + "WXSData1:"
                        + _random_item(t_data[1])
                        + ","
                        + "\r\n"
                        + "WXSData2:"
                        + _random_item(t_data[1])
                        + ","
                        + "\r\n"
                        + "WXSData3:"
                        + _random_item(t_data[1])
                        + ","
                    )
                else:
                    for data_num in range(type_num[1]):
                        string1 += (
                            "\r\n"
                            + "WXSData"
                            + str(data_num)
                            + ":"
                            + _random_item(t_data[1])
                            + ","
                        )

                string1 += "\r\n"
                if type_num[2] < 4:
                    string1 += (
                        "\r\n"
                        + "f0:"
                        + _random_item(DataType.WXS_FUNCTION)
                        + ","
                        + "\r\n"
                        + "f1:"
                        + _random_item(DataType.WXS_FUNCTION)
                        + ","
                        + "\r\n"
                        + "f2:"
                        + _random_item(DataType.WXS_FUNCTION)
                        + ","
                        + "\r\n"
                        + "f3:"
                        + _random_item(DataType.WXS_FUNCTION)
                        + ","
                    )
                else:
                    for data_num in range(type_num[2]):
                        string1 += (
                            "\r\n"
                            + "f"
                            + str(data_num)
                            + ":"
                            + _random_item(DataType.WXS_FUNCTION)
                            + ","
                        )
                file_string += string1 + "\r\n"

        _write_file(case_path, suffix, file_string)
    except OSError as error:
        print("读取文件时发生错误", error)


def make_js_file(t_data, type_num, case_path, sa=0):
    suffix = ".js"
    try:
        file_string = ""
        data = _read_template(suffix, sa)

        for line in data.splitlines():
            file_string += line + "\r\n"
            if "data: {" in line:
                string1 = ""
                if type_num[0] < 4:
                    string1 = (
                        "\r\n"
                        + "JSData0:"
                        + _random_item(t_data[1])
                        + ","
                        + "\r\n"
                        + "JSData1:"
                        + _random_item(t_data[1])
                        + ","
                        + "\r\n"
                        + "JSData2:"
                        + _random_item(t_data[1])
                        + ","
                        + "\r\n"
                        + "JSData3:"
                        + _random_item(t_data[1])
                        + ","
                    )
                else:
                    for data_num in range(type_num[0]):
                        string1 += (
                            "\r\n"
                            + "JSData"
                            + str(data_num)
                            + ":"
                            + _random_item(t_data[1])
                            + ","
                        )
                file_string += string1 + "\r\n"

            if "JSList:[" in line:
                string1 = ""
                if type_num[0] == 0:
                    string1 = "\r\n" + _random_item(t_data[1]) + ","
                else:
                    for _ in range(type_num[0]):
                        if random.random() > 0.8:
                            string1 += "\r\n" + _random_item(t_data[1]) + ","
                file_string += string1 + "\r\n"

            if "this.setData({" in line:
                string1 = ""
                if type_num[0] == 0:
                    string1 = "\r\n" + "JSData0:" + _random_item(t_data[1]) + ","
                else:
                    for data_num in range(type_num[0]):
                        if random.random() > 0.6:
                            string1 += (
                                "\r\n"
                                + "JSData"
                                + str(data_num)
                                + ":"
                                + _random_item(t_data[1])
                                + ","
                            )
                file_string += string1 + "\r\n"

        _write_file(case_path, suffix, file_string)
    except OSError as error:
        print("读取文件时发生错误", error)


def make_wxml_file(modul1, modul2, modul3, modul4, t_data, api, oper, case_path, sa=0):
    type_num = [0, 0, 0, 0]
    suffix = ".axml" if sa else ".ttml"
    try:
        data = _read_template(suffix, sa)
        file_string = ""
        list_item_name = _random_item(DataType.DATA_NAME)

        for line in data.splitlines():
            while "{{1}}" in line:
                tmp_data = ""
                write_num = random.randrange(DataType.T3[modul3]) + 1
                for w_num in range(write_num):
                    data_from = DataType.t2(modul2)
                    pri_data = DataType.add_api(api, data_from, type_num[data_from])
                    type_num[data_from] += DataType.t3_type(modul3)

                    if modul4 != 0:
                        pri_data = "MT.f" + str(type_num[2]) + "(" + pri_data + ")"
                    type_num[2] += DataType.T4[modul4]

                    if write_num > 1 and w_num != 0:
                        tmp_data = tmp_data + oper + pri_data
                    else:
                        tmp_data = pri_data

                line = line.replace("{{1}}", "{{" + tmp_data + "}}")
                print(line)

                for i in range(2, -1, -1):
                    if modul1 == 1:
                        type_num[i] += DataType.T1[modul1]
                    else:
                        type_num[i] = 0

            if "{{2}}" in line:
                line = line.replace("{{2}}", list_item_name)
                print(line)

            while "{{22}}" in line:
                line = line.replace("{{22}}", "{{" + list_item_name + "}}")
                print(line)

            file_string += line + "\r\n"

        _write_file(case_path, suffix, file_string)
    except OSError as error:
        print("读取文件时发生错误", error)
    return type_num
