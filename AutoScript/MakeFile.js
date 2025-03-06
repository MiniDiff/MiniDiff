
const DataType = require('./DataTypes')
const fs = require('fs');
const projectPath= 'F:/WeChatProjects/alltest'

var Template1 = ['{{a}}{{a}}','{{a}}{{b}}']
var Template2 = ['{{j}}','{{w}}']
var Template3 = ['{{a}}','{{a a}}','{{a b}}','{{a c}}']
var Template4 = ['{{F}','{{f}}','{{}}']

var DataString = ['']
var MakeWXSFile = function(TData,TypeNum,Path){
	//  chuli wxs
    try {
      FileString = ''
      const data = fs.readFileSync('index.wxs', 'utf8');
      data.split(/\r?\n/).forEach(line =>  {
        FileString = FileString + line + '\r\n'
        if(line.includes('module.exports = {')){
          var String1 = '' 
          if (TypeNum[1] < 4) {
            String1 = '\r\n' +  'WXSData0:' + TData[1][Math.floor(Math.random() * TData[1].length)] + ',' + '\r\n' +  'WXSData1:' + TData[1][Math.floor(Math.random() * TData[1].length)] + ',' +'\r\n' +  'WXSData2:' + TData[1][Math.floor(Math.random() * TData[1].length)] + ',' + '\r\n' +  'WXSData3:' + TData[1][Math.floor(Math.random() * TData[1].length)] + ','
          }else for(var DataNum = 0 ; DataNum < TypeNum[1] ; DataNum ++){
            String1 += '\r\n' +  'WXSData' + DataNum + ':' + TData[1][Math.floor(Math.random() * TData[1].length)] + ','
          }
          //console.log(String1);
          //添加函数
          String1 += '\r\n'
          if (TypeNum[2] < 4) {
            String1 += '\r\n' +  'f0:' + DataType.WXSFunction[Math.floor(Math.random() * DataType.WXSFunction.length)] + ',' +
             '\r\n' +  'f1:' + DataType.WXSFunction[Math.floor(Math.random() * DataType.WXSFunction.length)] + ',' +
             '\r\n' +  'f2:' + DataType.WXSFunction[Math.floor(Math.random() * DataType.WXSFunction.length)] + ',' +
             '\r\n' +  'f3:' + DataType.WXSFunction[Math.floor(Math.random() * DataType.WXSFunction.length)] + ','
          }else for(var DataNum = 0 ; DataNum < TypeNum[2] ; DataNum ++){
            String1 += '\r\n' +  'f' + DataNum + ':' + DataType.WXSFunction[Math.floor(Math.random() * DataType.WXSFunction.length)] +','
          }
          FileString = FileString + String1 + '\r\n'
        }
      });
      fs.writeFileSync(projectPath +'/pages/AutoTest/index.wxs', FileString);
      fs.writeFileSync( Path + '/index.wxs', FileString);
    }catch (error) {
      console.error('读取文件时发生错误:', error);
    }
}

var MakeJSFile = function(TData,TypeNum,Path){
	//数据声明 read js,wxs ，在对应位置 利用TypeNum 生成数据声明
    try {
	  FileString = ''
	  const data = fs.readFileSync('index.js', 'utf8');

	  data.split(/\r?\n/).forEach(line =>  {
	    FileString = FileString + line + '\r\n'
	    //在data中定义数据
	    if(line.includes('data: {')){
	      var String1 = '' 
	      if (TypeNum[0] < 4) {
	        String1 = '\r\n' +  'JSData0:' + TData[1][Math.floor(Math.random() * TData[1].length)] + ',' + '\r\n' +  'JSData1:' + TData[1][Math.floor(Math.random() * TData[1].length)] + ',' +'\r\n' +  'JSData2:' + TData[1][Math.floor(Math.random() * TData[1].length)] + ',' + '\r\n' +  'JSData3:' + TData[1][Math.floor(Math.random() * TData[1].length)] + ','
	      }else for(var DataNum = 0 ; DataNum < TypeNum[0] ; DataNum ++){
	        String1 += '\r\n' +  'JSData' + DataNum + ':' + TData[1][Math.floor(Math.random() * TData[1].length)] + ','
	      }
	      //console.log(String1);
	      FileString = FileString + String1 + '\r\n'
	    }
	    //在List中填入数据
	    if(line.includes('JSList:[')){
	    	var String1 = ''
	    	if (TypeNum[0] == 0) {
	    		String1 = '\r\n' + TData[1][Math.floor(Math.random() * TData[1].length)] + ','
	    	}else for(var DataNum = 0 ; DataNum < TypeNum[0] ; DataNum ++){
	    		if (Math.random() > 0.8) 
	        	String1 += '\r\n' + TData[1][Math.floor(Math.random() * TData[1].length)] + ','
	      	}
	    	FileString = FileString + String1 + '\r\n'
	    }
        //在函数的setData中设置需要的数据
        if (line.includes('this.setData({')) {
	    	var String1 = ''
	    	if (TypeNum[0] == 0) {
	    		String1 = '\r\n' +  'JSData0:' + TData[1][Math.floor(Math.random() * TData[1].length)] + ','
	    	}else for(var DataNum = 0 ; DataNum < TypeNum[0] ; DataNum ++){
	    		if (Math.random() > 0.6) 
	        	String1 += '\r\n' +  'JSData' + DataNum + ':' + TData[1][Math.floor(Math.random() * TData[1].length)] + ','
	      	}
	      	FileString = FileString + String1 + '\r\n'
        }
      });
      fs.writeFileSync(projectPath + '/pages/AutoTest/index.js', FileString);
      fs.writeFileSync( Path + '/index.js', FileString);
    }catch (error) {
      console.error('读取文件时发生错误:', error);
    }
}

var MakeWXMLFile = function(modul1,modul2,modul3,modul4,TData,Api,oper,Path){
	var TypeNum = [0,0,0,0]
    try {
      const data = fs.readFileSync('index.wxml', 'utf8');
      let pattern = /\{\{1\}\}/g;
      var FileString = ''
      var ListItemName = DataType.DataName[Math.floor(Math.random() * 6)]
      data.split(/\r?\n/).forEach(line =>  {
        //console.log('Line from file: ' +line);
        //console.log(line.indexOf("{{1}}")); 
        while(line.includes("{{1}}")){
          //根据模式3确定每个插槽填入几个数据
          var TmpData = ''
          var TWriteNum = Math.floor(Math.random() * DataType.T3[modul3]) + 1;
          for (var WNum = 0; WNum < TWriteNum; WNum++) {
            //DataFrom确定数据位置,根据模式2确定数据位置，即交互类型
            var DataFrom = DataType.T2(modul2)
            PriData = DataType.AddAPI(Api,DataFrom,TypeNum[DataFrom]);
            //console.log(PriData);
            TypeNum[DataFrom] += DataType.T3type(modul3)
            //一个wxs函数里的数据也可以按照模式3视为一个插槽处理，放多个变量用运算符连接
            if (modul4 != 0)  PriData = 'MT.f' + TypeNum[2] + '(' + PriData + ')'
            TypeNum[2] += DataType.T4[modul4]//modle4确定是否使用wxs函数处理，可以归纳进2
            //console.log(PriData);
            if (TWriteNum > 1 && WNum != 0) {
              TmpData =TmpData + oper + PriData
            }else TmpData = PriData
          }
          //字符串替换插入数据
          //console.log(line);
          line = line.replace(new RegExp(/\{\{1\}\}/g, ''), '{{' + TmpData + '}}');
          console.log(line);

          //生成一个槽的数据后，根据模式1确定其他槽的数据是否与该槽相同
          for (var i = 2; i >= 0; i--) {
            if(modul1 == 1)
              TypeNum[i] += DataType.T1[modul1]
            else TypeNum[i] = 0
          }
          //console.log(TWriteNum);
          //console.log(TmpData);
        }
        if (line.includes("{{2}}")) {
        	line = line.replace(new RegExp(/\{\{2\}\}/g, ''), ListItemName);
        	console.log(line);
        }
        while(line.includes("{{22}}")){
        	line = line.replace(new RegExp(/\{\{22\}\}/g, ''), '{{' + ListItemName + '}}');
        	console.log(line);

        }
        //写入文件
        FileString = FileString + line + '\r\n';
      });
      fs.writeFileSync(projectPath + '/pages/AutoTest/index.wxml', FileString);
      fs.writeFileSync( Path + '/index.wxml', FileString);
    }catch (error) {
      console.error('读取文件时发生错误:', error);
    }
    return TypeNum;
}



module.exports = {
  MakeWXMLFile,
  MakeJSFile,
  MakeWXSFile,

};
