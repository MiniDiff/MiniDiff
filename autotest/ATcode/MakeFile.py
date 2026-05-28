import random
from pathlib import Path

import DataTypes as DataType


projectPath = "F:/WeChatProjects/alltest"

Template1 = ["{{a}}{{a}}", "{{a}}{{b}}"]
Template2 = ["{{j}}", "{{w}}"]
Template3 = ["{{a}}", "{{a a}}", "{{a b}}", "{{a c}}"]
Template4 = ["{{F}", "{{f}}", "{{}}"]

DataString = [""]


def _random_item(values):
    return random.choice(values)


def _read_template(suffix, sa):
    Tpath = "AlipayT/" if sa else "TikTokT/"
    return Path(Tpath + "index" + suffix).read_text(encoding="utf-8")


def _write_file(path, suffix, content):
    Path(path).mkdir(parents=True, exist_ok=True)
    (Path(path) / ("index" + suffix)).write_text(content, encoding="utf-8", newline="")


def MakeWXSFile(TData, TypeNum, Path,sa):
    suffix = ".sjs"
    try:
        file_string = ""
        data = _read_template(suffix,sa)

        for line in data.splitlines():
            file_string += line + "\r\n"
            if "export default {" in line:
                string1 = ""
                if TypeNum[1] < 4:
                    string1 = (
                        "\r\n"
                        + "WXSData0:"
                        + _random_item(TData[1])
                        + ","
                        + "\r\n"
                        + "WXSData1:"
                        + _random_item(TData[1])
                        + ","
                        + "\r\n"
                        + "WXSData2:"
                        + _random_item(TData[1])
                        + ","
                        + "\r\n"
                        + "WXSData3:"
                        + _random_item(TData[1])
                        + ","
                    )
                else:
                    for DataNum in range(TypeNum[1]):
                        string1 += (
                            "\r\n"
                            + "WXSData"
                            + str(DataNum)
                            + ":"
                            + _random_item(TData[1])
                            + ","
                        )

                string1 += "\r\n"
                if TypeNum[2] < 4:
                    string1 += (
                        "\r\n"
                        + "f0:"
                        + _random_item(DataType.WXSFunction)
                        + ","
                        + "\r\n"
                        + "f1:"
                        + _random_item(DataType.WXSFunction)
                        + ","
                        + "\r\n"
                        + "f2:"
                        + _random_item(DataType.WXSFunction)
                        + ","
                        + "\r\n"
                        + "f3:"
                        + _random_item(DataType.WXSFunction)
                        + ","
                    )
                else:
                    for DataNum in range(TypeNum[2]):
                        string1 += (
                            "\r\n"
                            + "f"
                            + str(DataNum)
                            + ":"
                            + _random_item(DataType.WXSFunction)
                            + ","
                        )
                file_string += string1 + "\r\n"

        _write_file(Path, suffix, file_string)
    except Exception as error:
        print("读取文件时发生错误", error)


def MakeJSFile(TData, TypeNum, Path, sa):
    suffix = ".js"
    try:
        file_string = ""
        data = _read_template(suffix, sa)

        for line in data.splitlines():
            file_string += line + "\r\n"
            if "data: {" in line:
                string1 = ""
                if TypeNum[0] < 4:
                    string1 = (
                        "\r\n"
                        + "JSData0:"
                        + _random_item(TData[1])
                        + ","
                        + "\r\n"
                        + "JSData1:"
                        + _random_item(TData[1])
                        + ","
                        + "\r\n"
                        + "JSData2:"
                        + _random_item(TData[1])
                        + ","
                        + "\r\n"
                        + "JSData3:"
                        + _random_item(TData[1])
                        + ","
                    )
                else:
                    for DataNum in range(TypeNum[0]):
                        string1 += (
                            "\r\n"
                            + "JSData"
                            + str(DataNum)
                            + ":"
                            + _random_item(TData[1])
                            + ","
                        )
                file_string += string1 + "\r\n"

            if "JSList:[" in line:
                string1 = ""
                if TypeNum[0] == 0:
                    string1 = "\r\n" + _random_item(TData[1]) + ","
                else:
                    for _ in range(TypeNum[0]):
                        if random.random() > 0.8:
                            string1 += "\r\n" + _random_item(TData[1]) + ","
                file_string += string1 + "\r\n"

            if "this.setData({" in line:
                string1 = ""
                if TypeNum[0] == 0:
                    string1 = "\r\n" + "JSData0:" + _random_item(TData[1]) + ","
                else:
                    for DataNum in range(TypeNum[0]):
                        if random.random() > 0.6:
                            string1 += (
                                "\r\n"
                                + "JSData"
                                + str(DataNum)
                                + ":"
                                + _random_item(TData[1])
                                + ","
                            )
                file_string += string1 + "\r\n"

        _write_file(Path, suffix, file_string)
    except Exception as error:
        print("读取文件时发生错误", error)


def MakeWXMLFile(modul1, modul2, modul3, modul4, TData, Api, oper, Path, sa):
    TypeNum = [0, 0, 0, 0]
    suffix = ".axml" if sa else ".ttml"
    try:
        data = _read_template(suffix,sa)
        file_string = ""
        list_item_name = _random_item(DataType.DataName)

        for line in data.splitlines():
            while "{{1}}" in line:
                tmp_data = ""
                write_num = random.randrange(DataType.T3[modul3]) + 1
                for WNum in range(write_num):
                    data_from = DataType.T2(modul2)
                    pri_data = DataType.AddAPI(Api, data_from, TypeNum[data_from])
                    TypeNum[data_from] += DataType.T3type(modul3)

                    if modul4 != 0:
                        pri_data = "MT.f" + str(TypeNum[2]) + "(" + pri_data + ")"
                    TypeNum[2] += DataType.T4[modul4]

                    if write_num > 1 and WNum != 0:
                        tmp_data = tmp_data + oper + pri_data
                    else:
                        tmp_data = pri_data

                line = line.replace("{{1}}", "{{" + tmp_data + "}}")
                print(line)

                for i in range(2, -1, -1):
                    if modul1 == 1:
                        TypeNum[i] += DataType.T1[modul1]
                    else:
                        TypeNum[i] = 0

            if "{{2}}" in line:
                line = line.replace("{{2}}", list_item_name)
                print(line)

            while "{{22}}" in line:
                line = line.replace("{{22}}", "{{" + list_item_name + "}}")
                print(line)

            file_string += line + "\r\n"

        _write_file(Path, suffix, file_string)
    except Exception as error:
        print("读取文件时发生错误", error)
    return TypeNum


make_wxs_file = MakeWXSFile
make_js_file = MakeJSFile
make_wxml_file = MakeWXMLFile
