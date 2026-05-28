import asyncio
import os
import time
from pathlib import Path

import DataTypes as DataType
import MakeFile


DataName = ["JSData", "JSLData", "WXSData", "WXSLData", "GENdata", "MT"]
TotalDataNum = 14

DataTypes = DataType.DataTypes
operators = DataType.operators
RootPath = "../AlipayAutoTestResult/"
LogString = ""
SLogString = ""

flag = True
logflag = 2 * 1

oldTime = int(time.time() * 1000)
timeFlag = False


async def exec():
    for modul1 in range(2):
        for modul2 in range(3):
            for modul3 in range(3):
                for modul4 in range(3):
                    for DTNum in range(len(DataTypes) - 1, -1, -1):
                        for ApiNum in range(0, -1, -1):
                            for operNum in range(len(operators) - 1, -1, -1):
                                num = (
                                    "A"
                                    + str(modul1)
                                    + str(modul2)
                                    + str(modul3)
                                    + str(modul4)
                                    + DataTypes[DTNum][0]
                                    + str(ApiNum)
                                    + str(operNum)
                                )
                                output_path = Path(RootPath) / num
                                os.makedirs(output_path, exist_ok=True)

                                type_num = MakeFile.MakeWXMLFile(
                                    modul1,
                                    modul2,
                                    modul3,
                                    modul4,
                                    DataTypes[DTNum],
                                    DataTypes[DTNum][2][ApiNum],
                                    operators[operNum],
                                    output_path,
                                )
                                MakeFile.MakeJSFile(DataTypes[DTNum], type_num, output_path)
                                MakeFile.MakeWXSFile(DataTypes[DTNum], type_num, output_path)

                                if modul3 == 0:
                                    break


async def timeoutPromise(func, timeout):
    return await asyncio.wait_for(func(), timeout=timeout / 1000)


def OutTime():
    global oldTime
    newTime = int(time.time() * 1000)
    if (newTime - oldTime > outTime) and timeFlag:
        print("时间到")


if __name__ == "__main__":
    asyncio.run(exec())
