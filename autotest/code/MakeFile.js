const DataType = require('./DataTypes');
const fs = require('fs');

const projectPath = 'F:/WeChatProjects/alltest';

const Template1 = ['{{a}}{{a}}', '{{a}}{{b}}'];
const Template2 = ['{{j}}', '{{w}}'];
const Template3 = ['{{a}}', '{{a a}}', '{{a b}}', '{{a c}}'];
const Template4 = ['{{F}', '{{f}}', '{{}}'];

const DataString = [''];

const MakeWXSFile = function (TData, TypeNum, Path) {
  const suffix = '.wxs';
  // chuli wxs
  try {
    let FileString = '';
    const data = fs.readFileSync(`index${suffix}`, 'utf8');
    data.split(/\r?\n/).forEach(line => {
      FileString += `${line}\r\n`;
      if (line.includes('export default {')) {
        let String1 = '';
        if (TypeNum[1] < 4) {
          String1 = [
            `\r\nWXSData0:${TData[1][Math.floor(Math.random() * TData[1].length)]},`,
            `\r\nWXSData1:${TData[1][Math.floor(Math.random() * TData[1].length)]},`,
            `\r\nWXSData2:${TData[1][Math.floor(Math.random() * TData[1].length)]},`,
            `\r\nWXSData3:${TData[1][Math.floor(Math.random() * TData[1].length)]},`,
          ].join('');
        } else {
          for (let DataNum = 0; DataNum < TypeNum[1]; DataNum++) {
            String1 += `\r\nWXSData${DataNum}:${TData[1][Math.floor(Math.random() * TData[1].length)]},`;
          }
        }
        // console.log(String1);
        // 添加函数
        String1 += '\r\n';
        if (TypeNum[2] < 4) {
          String1 += [
            `\r\nf0:${DataType.WXSFunction[Math.floor(Math.random() * DataType.WXSFunction.length)]},`,
            `\r\nf1:${DataType.WXSFunction[Math.floor(Math.random() * DataType.WXSFunction.length)]},`,
            `\r\nf2:${DataType.WXSFunction[Math.floor(Math.random() * DataType.WXSFunction.length)]},`,
            `\r\nf3:${DataType.WXSFunction[Math.floor(Math.random() * DataType.WXSFunction.length)]},`,
          ].join('');
        } else {
          for (let DataNum = 0; DataNum < TypeNum[2]; DataNum++) {
            const wxsFunction = DataType.WXSFunction[Math.floor(Math.random() * DataType.WXSFunction.length)];
            String1 += `\r\nf${DataNum}:${wxsFunction},`;
          }
        }
        FileString += `${String1}\r\n`;
      }
    });
    // fs.writeFileSync(`${projectPath}/pages/AutoTest/index.wxs`, FileString);
    fs.writeFileSync(`${Path}/index${suffix}`, FileString);
  } catch (error) {
    console.error('读取文件时发生错误:', error);
  }
};

const MakeJSFile = function (TData, TypeNum, Path) {
  // 数据声明 read js,wxs ，在对应位置 利用TypeNum 生成数据声明
  const suffix = '.js';
  try {
    let FileString = '';
    const data = fs.readFileSync(`index${suffix}`, 'utf8');

    data.split(/\r?\n/).forEach(line => {
      FileString += `${line}\r\n`;
      // 在data中定义数据
      if (line.includes('data: {')) {
        let String1 = '';
        if (TypeNum[0] < 4) {
          String1 = [
            `\r\nJSData0:${TData[1][Math.floor(Math.random() * TData[1].length)]},`,
            `\r\nJSData1:${TData[1][Math.floor(Math.random() * TData[1].length)]},`,
            `\r\nJSData2:${TData[1][Math.floor(Math.random() * TData[1].length)]},`,
            `\r\nJSData3:${TData[1][Math.floor(Math.random() * TData[1].length)]},`,
          ].join('');
        } else {
          for (let DataNum = 0; DataNum < TypeNum[0]; DataNum++) {
            String1 += `\r\nJSData${DataNum}:${TData[1][Math.floor(Math.random() * TData[1].length)]},`;
          }
        }
        // console.log(String1);
        FileString += `${String1}\r\n`;
      }
      // 在List中填入数据
      if (line.includes('JSList:[')) {
        let String1 = '';
        if (TypeNum[0] == 0) {
          String1 = `\r\n${TData[1][Math.floor(Math.random() * TData[1].length)]},`;
        } else {
          for (let DataNum = 0; DataNum < TypeNum[0]; DataNum++) {
            if (Math.random() > 0.8) {
              String1 += `\r\n${TData[1][Math.floor(Math.random() * TData[1].length)]},`;
            }
          }
        }
        FileString += `${String1}\r\n`;
      }
      // 在函数的setData中设置需要的数据
      if (line.includes('this.setData({')) {
        let String1 = '';
        if (TypeNum[0] == 0) {
          String1 = `\r\nJSData0:${TData[1][Math.floor(Math.random() * TData[1].length)]},`;
        } else {
          for (let DataNum = 0; DataNum < TypeNum[0]; DataNum++) {
            if (Math.random() > 0.6) {
              String1 += `\r\nJSData${DataNum}:${TData[1][Math.floor(Math.random() * TData[1].length)]},`;
            }
          }
        }
        FileString += `${String1}\r\n`;
      }
    });
    // fs.writeFileSync(`${projectPath}/pages/AutoTest/index.js`, FileString);
    fs.writeFileSync(`${Path}/index${suffix}`, FileString);
  } catch (error) {
    console.error('读取文件时发生错误:', error);
  }
};

const MakeWXMLFile = function (modul1, modul2, modul3, modul4, TData, Api, oper, Path) {
  const TypeNum = [0, 0, 0, 0];
  const suffix = '.wxml';
  try {
    const data = fs.readFileSync(`index${suffix}`, 'utf8');
    const pattern = /\{\{1\}\}/g;
    let FileString = '';
    let PriData = '';
    const ListItemName = DataType.DataName[Math.floor(Math.random() * 6)];
    data.split(/\r?\n/).forEach(line => {
      // console.log(`Line from file: ${line}`);
      // console.log(line.indexOf('{{1}}'));
      while (line.includes('{{1}}')) {
        // 根据模式3确定每个插槽填入几个数据
        let TmpData = '';
        const TWriteNum = Math.floor(Math.random() * DataType.T3[modul3]) + 1;
        for (let WNum = 0; WNum < TWriteNum; WNum++) {
          // DataFrom确定数据位置,根据模式2确定数据位置，即交互类型
          const DataFrom = DataType.T2(modul2);
          PriData = DataType.AddAPI(Api, DataFrom, TypeNum[DataFrom]);
          // console.log(PriData);
          TypeNum[DataFrom] += DataType.T3type(modul3);
          // 一个wxs函数里的数据也可以按照模式3视为一个插槽处理，放多个变量用运算符连接
          if (modul4 != 0) {
            PriData = `MT.f${TypeNum[2]}(${PriData})`;
          }
          TypeNum[2] += DataType.T4[modul4]; // modle4确定是否使用wxs函数处理，可以归纳进2
          // console.log(PriData);
          if (TWriteNum > 1 && WNum != 0) {
            TmpData += `${oper}${PriData}`;
          } else {
            TmpData = PriData;
          }
        }
        // 字符串替换插入数据
        // console.log(line);
        line = line.replace(new RegExp(/\{\{1\}\}/g, ''), `{{${TmpData}}}`);
        console.log(line);

        // 生成一个槽的数据后，根据模式1确定其他槽的数据是否与该槽相同
        for (let i = 2; i >= 0; i--) {
          if (modul1 == 1) {
            TypeNum[i] += DataType.T1[modul1];
          } else {
            TypeNum[i] = 0;
          }
        }
        // console.log(TWriteNum);
        // console.log(TmpData);
      }
      if (line.includes('{{2}}')) {
        line = line.replace(new RegExp(/\{\{2\}\}/g, ''), ListItemName);
        console.log(line);
      }
      while (line.includes('{{22}}')) {
        line = line.replace(new RegExp(/\{\{22\}\}/g, ''), `{{${ListItemName}}}`);
        console.log(line);
      }
      // 写入文件
      FileString += `${line}\r\n`;
    });
    // fs.writeFileSync(`${projectPath}/pages/AutoTest/index${suffix}`, FileString);
    fs.writeFileSync(`${Path}/index${suffix}`, FileString);
  } catch (error) {
    console.error('读取文件时发生错误:', error);
  }
  return TypeNum;
};

module.exports = {
  MakeWXMLFile,
  MakeJSFile,
  MakeWXSFile,
};
