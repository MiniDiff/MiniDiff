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
var flag = true, logflag = 2 * 1;

var oldTime = new Date().getTime(), timeFlag = false;

exec()

async function exec(){
  for (var modul1 = 0; modul1 < 2; modul1++) {
    for (var modul2 = 0; modul2 < 3; modul2++) {
      for (var modul3 = 0; modul3 < 3; modul3++) {
        for (var modul4 = 0; modul4 < 3; modul4++) {
          //data
          for (var DTNum = DataTypes.length - 1; DTNum >= 0; DTNum--) {
            //unitity function
            for (var ApiNum = 0; ApiNum >= 0; ApiNum--) {//DataTypes[DTNum][2].length - 1
              for (var operNum = operators.length - 1; operNum >= 0; operNum--) {
                //if(DataTypes[DTNum][0] === 'regexp' && (modul2 == 0 || modul2 == 2))break
                var Num = 'A' + modul1 + modul2 + modul3 + modul4 + DataTypes[DTNum][0] + ApiNum + operNum
                if (!fs.existsSync(RootPath + Num))fs.mkdirSync(RootPath + Num );

                TypeNum = MakeFile.MakeWXMLFile(modul1,modul2,modul3,modul4,DataTypes[DTNum],DataTypes[DTNum][2][ApiNum],operators[operNum],RootPath + Num);
                MakeFile.MakeJSFile(DataTypes[DTNum],TypeNum,RootPath + Num);
                MakeFile.MakeWXSFile(DataTypes[DTNum],TypeNum,RootPath + Num);
                
                await automator.launch({
                  //wsEndpoint: 'ws://127.0.0.1:9420',
                  cliPath: 'F:/tool/Tencent/devtools1.06.2410222/cli.bat', //devtools cli path
                  projectPath: 'F:/WeChatProjects/alltest',//process.cwd(), // code file path'F:/WeChatProjects/alltest'
                }).then(async miniProgram => {
                  //startTime = new Date().getTime();while (new Date().getTime() < startTime + 5000);
                  conf = 'DevTools'//Android or Windows
                  console.log('AutoTest:' +Num + "  " + conf);
                  if (!fs.existsSync(RootPath + Num + '/' + conf))fs.mkdirSync(RootPath + Num + '/' + conf)
                  
                  timeFlag = true
                  while(timeFlag){
                    await timeoutPromise(async function(){
                      await miniProgram.remote()//chose devtool or android://await miniProgram.remote(true)
                      var SLogString = ''
                      miniProgram.on('console', msg => {SLogString += msg.args + '\r\n'}) 
                      SLogString = ''
                      const Spage = await miniProgram.reLaunch('index')
                      const Selement = await Spage.$('page')
                      const SPageWxml = await Selement.outerWxml()
                      console.log(SPageWxml)
                      fs.writeFileSync(RootPath + Num + '/' + conf + '/' +'wxml.txt', SPageWxml);

                      const Tapelement = await Spage.$('#Button')
                      await Tapelement.tap()
                      const TapSelement = await Spage.$('page')
                      const TapWxml = await TapSelement.outerWxml()
                      console.log(TapWxml)
                      fs.writeFileSync(RootPath + Num + '/' + conf + '/' +'wxml2.txt', TapWxml);

                      const Spage2 = await miniProgram.reLaunch('index')
                      const Selement2 = await Spage2.$('page')
                      const SPageWxml2 = await Selement2.outerWxml()
                      console.log(SPageWxml2)
                      fs.writeFileSync(RootPath + Num + '/' + conf + '/' +'wxml3.txt', SPageWxml2);

                      const Inputelement = await Spage2.$('#Input')
                      await Inputelement.input('test')
                      const InputeSelement = await Spage2.$('page')
                      const InputeWxml = await InputeSelement.outerWxml()
                      console.log(InputeWxml)
                      fs.writeFileSync(RootPath + Num + '/' + conf + '/' +'wxml4.txt', InputeWxml);

                      //await miniProgram.screenshot({path: RootPath + Num + '/' + conf + '/' + 'screenshot0.png'})
                      fs.writeFileSync(RootPath + Num + '/' + conf + '/' +'Log.txt', SLogString);
                      console.log("Alog:" + SLogString)
                    }, 60000)
                      .then(result => timeFlag = false)
                      .catch(error => console.error(error.message));
                  }
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
  return new Promise(async (resolve, reject) => {
    const timer = setTimeout(() => {
      console.log('Operation timed out');
      reject(new Error('Operation timed out'));
    }, timeout);
 
    try {
      const result = await func();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      clearTimeout(timer);
    }
  });
}

function OutTime(){
  newTime = new Date().getTime(); 
  if((newTime - oldTime > outTime) && timeFlag){ 
      console.log("time over");
  }
}

