const automator = require('miniprogram-automator')

automator.launch({
  cliPath: 'F:/tool/Tencent/微信web开发者工具/cli.bat', // 工具 cli 位置，如果你没有更改过默认安装位置，可以忽略此项
  projectPath: process.cwd(), // 项目文件地址
}).then(async miniProgram => {
  miniProgram.on('console', msg => {
  console.log(msg.type, msg.args)
  })
  const page = await miniProgram.reLaunch('index')
  const element = await page.$('page')
  console.log(await element.wxml())
  await miniProgram.screenshot({
    path: 'autotest/' + Num + '/' + conf + '/screenshot0.png'
  })

  const page2 = await miniProgram.navigateTo('/pages/AutoTest/index')
  const element2 = await page2.$('page')
  console.log(await element2.wxml())
  await miniProgram.screenshot({
    path: 'autotest/' + Num + '/' + conf + '/screenshot1.png'
  })
})




