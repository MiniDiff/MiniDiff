const DataType = require('./DataTypes')
const MakeFile = require('./MakeFile')
const fs = require('fs')
const path = require('path')

const DataTypes = DataType.DataTypes
const operators = DataType.operators

const config = parseArgs(process.argv.slice(2))
const ResultPath = config.resultPath
const DevToolsCliPath = config.devToolsCliPath
const TestProjectPath = config.testProjectPath
const TestCodePath = path.join(TestProjectPath, '/pages/AutoTest/')
const platform = config.platform
const conf = config.conf
const automator = require('miniprogram-automator')

let timeFlag = false

exec()

async function exec() {
  generateCases()
  await runGeneratedCases()
}

function generateCases() {
  ensureDir(ResultPath)

  for (let modul1 = 0; modul1 < 2; modul1++) {
    for (let modul2 = 0; modul2 < 3; modul2++) {
      for (let modul3 = 0; modul3 < 3; modul3++) {
        for (let modul4 = 0; modul4 < 3; modul4++) {
          for (let DTNum = DataTypes.length - 1; DTNum >= 0; DTNum--) {
            for (let ApiNum = 0; ApiNum >= 0; ApiNum--) {
              for (let operNum = operators.length - 1; operNum >= 0; operNum--) {
                const Num = makeCaseName(modul1, modul2, modul3, modul4, DTNum, ApiNum, operNum)
                const casePath = path.join(ResultPath, Num)
                ensureDir(casePath)

                const TypeNum = MakeFile.MakeWXMLFile(
                  modul1,
                  modul2,
                  modul3,
                  modul4,
                  DataTypes[DTNum],
                  DataTypes[DTNum][2][ApiNum],
                  operators[operNum],
                  casePath
                )
                MakeFile.MakeJSFile(DataTypes[DTNum], TypeNum, casePath)
                MakeFile.MakeWXSFile(DataTypes[DTNum], TypeNum, casePath)

                if (modul3 == 0) break
              }
            }
          }
        }
      }
    }
  }
}

async function runGeneratedCases() {
  const caseNames = fs.readdirSync(ResultPath)
    .filter(name => fs.statSync(path.join(ResultPath, name)).isDirectory())
    .sort()

  for (const Num of caseNames) {
    const casePath = path.join(ResultPath, Num)
    copyCaseToProject(casePath)
    await runCase(Num)
  }
}

function copyCaseToProject(casePath) {
  ensureDir(TestCodePath)
  switch (conf) {
    case 'EW':
      copyRequiredFile('app.json', path.join(TestProjectPath, 'app.json'))
      break
    case 'GW':
      copyRequiredFile('gapp.json', path.join(TestProjectPath, 'app.json'))
      break
    case 'GS':
      copyRequiredFile('sapp.json', path.join(TestProjectPath, 'app.json'))
      break
    default:
      throw new Error('Unsupported conf: ' + conf)
  }
  copyRequiredFile(path.join(casePath, 'index.wxml'), path.join(TestCodePath, 'index.wxml'))
  copyRequiredFile(path.join(casePath, 'index.js'), path.join(TestCodePath, 'index.js'))
  copyRequiredFile(path.join(casePath, 'index.wxs'), path.join(TestCodePath, 'index.wxs'))
}

async function runCase(Num) {
  await automator.launch({
    // wsEndpoint: 'ws://127.0.0.1:9420',
    cliPath: DevToolsCliPath,
    projectPath: TestProjectPath,
  }).then(async miniProgram => {
    console.log('AutoTest:' + Num + '  ' + platform)
    ensureDir(path.join(ResultPath, Num, platform))

    timeFlag = true
    while (timeFlag) {
      await timeoutPromise(async function () {
        if(platform != 'DevTools')
          await miniProgram.remote()
        let SLogString = ''
        miniProgram.on('console', msg => { SLogString += msg.args + '\r\n' })
        SLogString = ''

        const Spage = await miniProgram.reLaunch('index')
        const Selement = await Spage.$('page')
        const SPageWxml = await Selement.outerWxml()
        console.log(SPageWxml)
        fs.writeFileSync(path.join(ResultPath, Num, platform, 'wxml.txt'), SPageWxml)

        const Tapelement = await Spage.$('#Button')
        await Tapelement.tap()
        const TapSelement = await Spage.$('page')
        const TapWxml = await TapSelement.outerWxml()
        console.log(TapWxml)
        fs.writeFileSync(path.join(ResultPath, Num, platform, 'wxml2.txt'), TapWxml)

        const Spage2 = await miniProgram.reLaunch('index')
        const Selement2 = await Spage2.$('page')
        const SPageWxml2 = await Selement2.outerWxml()
        console.log(SPageWxml2)
        fs.writeFileSync(path.join(ResultPath, Num, platform, 'wxml3.txt'), SPageWxml2)

        const Inputelement = await Spage2.$('#Input')
        await Inputelement.input('test')
        const InputeSelement = await Spage2.$('page')
        const InputeWxml = await InputeSelement.outerWxml()
        console.log(InputeWxml)
        fs.writeFileSync(path.join(ResultPath, Num, platform, 'wxml4.txt'), InputeWxml)

        fs.writeFileSync(path.join(ResultPath, Num, platform, 'Log.txt'), SLogString)
        console.log('Alog:' + SLogString)
      }, 60000)
        .then(result => { timeFlag = false })
        .catch(error => console.error(error.message))
    }
    await miniProgram.disconnect()
  })
}

function makeCaseName(modul1, modul2, modul3, modul4, DTNum, ApiNum, operNum) {
  return 'A' + modul1 + modul2 + modul3 + modul4 + DataTypes[DTNum][0] + ApiNum + operNum
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true })
}

function copyRequiredFile(source, destination) {
  if (!fs.existsSync(source)) throw new Error('Missing generated file: ' + source)
  fs.copyFileSync(source, destination)
}

function parseArgs(argv) {
  const config = {
    resultPath: '../AutoTestResult/',
    platform: 'DevTools',
    conf: 'EW',
    devToolsCliPath: '',
    testProjectPath: '',
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '-h' || arg === '--help') {
      printUsage()
      process.exit(0)
    }

    const [rawKey, inlineValue] = arg.split('=', 2)
    if (!rawKey.startsWith('--')) {
      console.error('Unknown argument: ' + arg)
      printUsage()
      process.exit(1)
    }

    const key = rawKey.slice(2)
    const value = inlineValue !== undefined ? inlineValue : argv[++i]
    if (value === undefined || value.startsWith('--')) {
      console.error('Missing value for argument: ' + rawKey)
      printUsage()
      process.exit(1)
    }

    if (key === 'result-path' || key === 'ResultPath') {
      config.resultPath = value
    } else if (key === 'devtools-cli-path' || key === 'DevToolsCliPath') {
      config.devToolsCliPath = value
    } else if (key === 'test-project-path' || key === 'TestProjectPath') {
      config.testProjectPath = value
    } else if (key === 'platform') {
      config.platform = value
    } else if (key === 'conf') {
      config.conf = value
    }else {
      console.error('Unknown argument: ' + rawKey)
      printUsage()
      process.exit(1)
    }
  }

  const missing = []
  if (!config.devToolsCliPath) missing.push('--devtools-cli-path')
  if (!config.testProjectPath) missing.push('--test-project-path')
  if (missing.length > 0) {
    console.error('Missing required argument(s): ' + missing.join(', '))
    printUsage()
    process.exit(1)
  }

  return config
}

function printUsage() {
  console.log([
    'Usage:',
    '  node auto.spec2.js --devtools-cli-path <path> --test-project-path <path> [options]',
    '',
    'Required:',
    '  --devtools-cli-path <path>    WeChat DevTools cli.bat path',
    '  --test-project-path <path>    Mini-program project path',
    '',
    'Options:',
    '  --result-path <path>          Generated case/result directory, default: ../AutoTestResult/',
    '  --platform <name>                 Result platform folder name, default: DevTools',
    '  --conf <name>                 Result config folder name, default: EW',
    '  -h, --help                    Show this help',
  ].join('\n'))
}

function timeoutPromise(func, timeout) {
  return new Promise(async (resolve, reject) => {
    const timer = setTimeout(() => {
      console.log('Operation timed out')
      reject(new Error('Operation timed out'))
    }, timeout)

    try {
      const result = await func()
      resolve(result)
    } catch (error) {
      reject(error)
    } finally {
      clearTimeout(timer)
    }
  })
}
