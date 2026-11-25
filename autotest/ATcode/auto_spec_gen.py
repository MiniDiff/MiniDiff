import asyncio
import os
import time
from pathlib import Path

import data_types as DataType
import make_file


DATA_NAME = ["JSData", "JSLData", "WXSData", "WXSLData", "GENdata", "MT"]
TOTAL_DATA_NUM = 14

DATA_TYPES = DataType.DATA_TYPES
OPERATORS = DataType.OPERATORS
ROOT_PATH = "../AlipayAutoTestResult/"
LOG_STRING = ""
SLOG_STRING = ""

FLAG = True
LOG_FLAG = 2 * 1

OLD_TIME = int(time.time() * 1000)
TIME_FLAG = False
OUT_TIME = 60000


async def exec():
    for modul1 in range(2):
        for modul2 in range(3):
            for modul3 in range(3):
                for modul4 in range(3):
                    for dt_num in range(len(DATA_TYPES) - 1, -1, -1):
                        for api_num in range(0, -1, -1):
                            for oper_num in range(len(OPERATORS) - 1, -1, -1):
                                num = (
                                    "A"
                                    + str(modul1)
                                    + str(modul2)
                                    + str(modul3)
                                    + str(modul4)
                                    + DATA_TYPES[dt_num][0]
                                    + str(api_num)
                                    + str(oper_num)
                                )
                                output_path = Path(ROOT_PATH) / num
                                os.makedirs(output_path, exist_ok=True)

                                type_num = make_file.make_wxml_file(
                                    modul1,
                                    modul2,
                                    modul3,
                                    modul4,
                                    DATA_TYPES[dt_num],
                                    DATA_TYPES[dt_num][2][api_num],
                                    OPERATORS[oper_num],
                                    output_path,
                                )
                                make_file.make_js_file(DATA_TYPES[dt_num], type_num, output_path)
                                make_file.make_wxs_file(DATA_TYPES[dt_num], type_num, output_path)

                                if modul3 == 0:
                                    break


async def timeout_promise(func, timeout):
    return await asyncio.wait_for(func(), timeout=timeout / 1000)


def check_timeout():
    new_time = int(time.time() * 1000)
    if (new_time - OLD_TIME > OUT_TIME) and TIME_FLAG:
        print("时间到")


if __name__ == "__main__":
    asyncio.run(exec())
