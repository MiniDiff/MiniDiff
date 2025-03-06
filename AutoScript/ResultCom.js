const pixelmatch = require('pixelmatch');
const fs = require('fs');
const path = require('path');
const { log } = require('console');

const pictuteWidth = 360
const pictuteHeight = 640
const totalPixels = pictuteWidth * pictuteHeight;
const ResultPath = '../autotest/AutoTestResult/'
const ResultPathDir = path.join(__dirname, '../' + ResultPath); // 替换为你的目录路径
var ResultString = ''
 
fs.readdir(ResultPathDir, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  } 
  var count = 0,totalSim = 0
  var high = 0,low = 100
  // 文件列表在files变量中
  for (var i = files.length - 1; i >= 0; i--) {
  	file = files[i];//通过file可以解析result的模式，拆分成字符串数组：A + m1（1位数） + m2（1位数） + m3（1位数） + m4（1位数） + 数据类型（字符串） + API（可能有两位） + 操作符（1位数）
  	//例如：不考虑API M[5] = 0
    filePath = ResultPath + file + '/'
    console.log(filePath);
    imgPath1 = filePath + 'noSkyline/screenshot0.png'
    imgPath2 = filePath + 'Skyline/screenshot0.png'
    if (!fs.existsSync(imgPath1) || !fs.existsSync(imgPath2)) {continue;}
    const img1Data = fs.readFileSync(imgPath1);
    const img2Data = fs.readFileSync(imgPath2);
    const diff = pixelmatch(img1Data, img2Data, null, pictuteWidth, pictuteHeight);
    //console.log(`Images diffe:` + diff);
    const similarity = (1 - diff / totalPixels) * 100;
    console.log(`Images are ${similarity.toFixed(2)}% similar.`);
    if (similarity < 99.0) {
      ResultString += file + '\t:\t' + similarity + '\r\n' 
      count ++
    }
    totalSim += similarity
    if(high < similarity) high = similarity
    if(low > similarity) low = similarity
    //path + log.txt  对比log
  }
  console.log("Total File Num:" + files.length + " Unsim Num:" + count + ' average:' + totalSim / files.length)
  console.log("high:" + high + " low:" + low)
  fs.writeFileSync('../autotest/DiffResult.txt', ResultString);
});

/*
// 读取图片

 
// 将图片解码为图像数据
const img1Data = PNG.sync.read(img1);
const img2Data = PNG.sync.read(img2);
 
// 比较图片
const diff = pixelmatch(img1Data.data, img2Data.data, null, img1Data.width, img1Data.height);
 
// 计算相似度百分比
const totalPixels = img1Data.width * img1Data.height;
const similarity = (1 - diff / totalPixels) * 100;
console.log(`Images are ${similarity.toFixed(2)}% similar.`);
*/