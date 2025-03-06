const { log } = require('console');
const DataType = require('./DataTypes')
const MakeFile = require('./MakeFile')
const fs = require('fs');
const automator = require('miniprogram-automator')

const DataName = ['JSData','JSLData','WXSData','WXSLData','GENdata','MT',]
const TotalDataNum = 14


const DataTypes = DataType.DataTypes
const operators = DataType.operators
const RootPath = '../AutoTestResult/'
var LogString = ''
var SLogString = ''

/*
console.log( "reLaunch Begin")
LogString = ''
const page = await miniProgram.reLaunch('index')
console.log( "reLaunch End")
//const element = await page.$('')
//const PageWxml = await element.wxml()
//console.log(PageWxml)
await miniProgram.screenshot({path: 'screenshot0.png'})
console.log( LogString)
*/
var flag = true, logflag = 2 * 1;

var oldTime = new Date().getTime(), timeFlag = false;

//A1222 number 00 各个部分解释：
//modul1，确定多个数据槽时数据相同，0表示所有数据槽都相同，1表示各不相同
//modul2，数据来源，0表示js，1表示wxs，2表示都有
//modul3，确定一个数据槽填入几个数据，0表示一个，1表示多个相同，2表示多个不同数据
//modul4，确定用不用wxs处理，0表示不用，1表示用同一个处理，2表示用不同wxs函数处理
//数据类型，直接用字符串表示
//处理函数，数据类型的api例如tostring
//多变量时连接符，+ - * /
//优先分析后面两位是00的，尤其是倒数第二位是0的，即不考虑调用数据的处理函数了
exec()
async function exec(){
  for (var modul1 = 0; modul1 < 2; modul1++) {
    for (var modul2 = 0; modul2 < 3; modul2++) {
      for (var modul3 = 0; modul3 < 3; modul3++) {
        for (var modul4 = 0; modul4 < 3; modul4++) {
          //遍历数据类型
          for (var DTNum = DataTypes.length - 1; DTNum >= 0; DTNum--) {
            //每个变量对应的处理API
            for (var ApiNum = 0; ApiNum >= 0; ApiNum--) {//DataTypes[DTNum][2].length - 1
              //多个变量时结合的运算符 
              for (var operNum = operators.length - 1; operNum >= 0; operNum--) {
                //if(DataTypes[DTNum][0] === 'regexp' && (modul2 == 0 || modul2 == 2))break
                if(flag){
                  modul1=1;
                  modul2=2;
                  modul3=1;
                  modul4=2;
                  DTNum=5;
                  operNum=1;
                  flag=false
                }
                var Num = 'A' + modul1 + modul2 + modul3 + modul4 + DataTypes[DTNum][0] + ApiNum + operNum
                if (!fs.existsSync(RootPath + Num))fs.mkdirSync(RootPath + Num );

                TypeNum = MakeFile.MakeWXMLFile(modul1,modul2,modul3,modul4,DataTypes[DTNum],DataTypes[DTNum][2][ApiNum],operators[operNum],RootPath + Num);
                MakeFile.MakeJSFile(DataTypes[DTNum],TypeNum,RootPath + Num);
                MakeFile.MakeWXSFile(DataTypes[DTNum],TypeNum,RootPath + Num);
                
                await automator.launch({
                  //wsEndpoint: 'ws://127.0.0.1:9420',
                  cliPath: 'F:/tool/Tencent/微信开发工具1.06.2410222/cli.bat', // 工具 cli 位置，如果你没有更改过默认安装位置，可以忽略此项
                  projectPath: 'F:/WeChatProjects/alltest',//process.cwd(), // 项目文件地址'F:/WeChatProjects/alltest'
                }).then(async miniProgram => {
                  //startTime = new Date().getTime();while (new Date().getTime() < startTime + 5000);
                  conf = 'DevTool'
                  console.log('AutoTest:' +Num + "  " + conf);
                  if (!fs.existsSync(RootPath + Num + '/' + conf))fs.mkdirSync(RootPath + Num + '/' + conf)
                  //let JSONdata = fs.readFileSync('autotest/app.json');fs.writeFileSync('app.json', JSONdata);
                  //if (logflag > 0 ){logflag--;
                  miniProgram.on('console', msg => {LogString += msg.args + '\r\n'})
                  //}else{miniProgram.on('console', msg => {})}
                  LogString = ''
                  //await miniProgram.remote(true)
                  //var page = await miniProgram.currentPage()
                  var page = await miniProgram.reLaunch('index')            
                  console.log('get currentPage');
                  const element = await page.$('page')
                  console.log('get page element');
                  const PageWxml = await element.outerWxml()
                  console.log(PageWxml)
                  fs.writeFileSync(RootPath + Num + '/' + conf + '/' +'wxml.txt', PageWxml);
                  //await miniProgram.screenshot({path: RootPath + Num + '/' + conf + '/' + 'screenshot0.png'})
                  fs.writeFileSync(RootPath + Num + '/' + conf + '/' +'Log.txt', LogString);
                  console.log("Dlog" + LogString)
                  //await miniProgram.close()
                  //await miniProgram.disconnect()


                
                  conf = 'Android'
                  console.log('AutoTest:' +Num + "  " + conf);
                  if (!fs.existsSync(RootPath + Num + '/' + conf))fs.mkdirSync(RootPath + Num + '/' + conf)
                  
                  timeFlag = true
                  while(timeFlag){
                    await timeoutPromise(async function(){
                      await miniProgram.remote(true)
                      var SLogString = ''
                      miniProgram.on('console', msg => {SLogString += msg.args + '\r\n'}) 
                      SLogString = ''
                      const Spage = await miniProgram.reLaunch('index')
                      const Selement = await Spage.$('page')
                      const SPageWxml = await Selement.outerWxml()
                      console.log(SPageWxml)
                      fs.writeFileSync(RootPath + Num + '/' + conf + '/' +'wxml.txt', SPageWxml);
                      //await miniProgram.screenshot({path: RootPath + Num + '/' + conf + '/' + 'screenshot0.png'})
                      fs.writeFileSync(RootPath + Num + '/' + conf + '/' +'Log.txt', SLogString);
                      console.log("Alog:" + SLogString)
                    }, 60000)
                      .then(result => timeFlag = false)
                      .catch(error => console.error(error.message));
                  }

                  //startTime = new Date().getTime();while (new Date().getTime() < startTime + 5000);
                  //await miniProgram.remote(true) 
                  //JSONdata = fs.readFileSync('autotest/sapp.json');fs.writeFileSync('app.json', JSONdata);
                  //if (logflag > 0 ){logflag--;
                  //miniProgram.on('console', msg => {SLogString += msg.args + '\r\n'}) 
                  //}else{miniProgram.on('console', msg => {})}
                  //SLogString = ''
                  //const Spage = await miniProgram.currentPage()
                  //const Spage = await miniProgram.reLaunch('index')
                  //const Selement = await Spage.$('page')
                  //const SPageWxml = await Selement.wxml()
                  //console.log(SPageWxml)
                  //const Spage = await miniProgram.reLaunch('index')
                  //const Selement = await Spage.$('page')
                  //const SPageWxml = await Selement.wxml()
                  //console.log(SPageWxml)
                  //fs.writeFileSync(RootPath + Num + '/' + conf + '/' +'wxml.txt', SPageWxml);
                  //await miniProgram.screenshot({path: RootPath + Num + '/' + conf + '/' + 'screenshot0.png'})
                  //fs.writeFileSync(RootPath + Num + '/' + conf + '/' +'Log.txt', SLogString);
                  //console.log("Alog:" + SLogString)
                  //await miniProgram.close()
                  await miniProgram.disconnect()
                })
                if (modul3 == 0) break;
              }
            }
          }
        }
      }
    }
  }
}
function timeoutPromise(func, timeout) {
  // 创建一个Promise
  return new Promise(async (resolve, reject) => {
    // 设置超时定时器
    const timer = setTimeout(() => {
      console.log('Operation timed out');
      reject(new Error('Operation timed out'));
    }, timeout);
 
    // 执行传入的函数，并处理结果
    try {
      const result = await func();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      // 无论成功或失败，清除定时器
      clearTimeout(timer);
    }
  });
}

function OutTime(){
  newTime = new Date().getTime(); //更新未进行操作的当前时间
  if((newTime - oldTime > outTime) && timeFlag){ //判断是否超时不操作
      //超时后执行的操作
      console.log("时间到");
  }
}

