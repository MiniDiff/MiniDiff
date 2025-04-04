const DataName = ['JSData','MT.WXSData','JSLData','WXSLData','GENdata','MT',]
var Template1 = ['{{a}}{{a}}','{{a}}{{b}}']
var Template2 = ['{{j}}','{{w}}']
var Template3 = ['{{a}}','{{a a}}','{{a b}}','{{a c}}']
var Template4 = ['{{F}','{{f}}','{{}}']


var T1 = [0,1]
var T3 = [1,3,3]
var T4 = [0,0,1]

var DataTypes = [
    ['number',
        [1,2,3,3.141592653,1/3,0.1],
        ['AB','AB.toString()','AB.toLocaleString()','AB.valueOf()','AB.toFixed()','AB.toExponential()','AB.toPrecision()','AB.constructor'],],
    ['string',
        ['"123"','"stringtest"','"3.141592653"','"Hellow World"','"ASDFGHJKL"','"qwertyuiop"'],
        ['AB','AB.toString()','AB.valueOf()','AB.charAt(0)','AB.charCodeAt(0)','AB.concat(JSData0)','AB.indexOf(JSData0)','AB.lastIndexOf("a",JSData0)','AB.localeCompare(JSData0)','AB.replace("/a/g","aaa")','AB.toUpperCase()','AB.toLocaleUpperCase()','AB.trim()','AB.toLocaleLowerCase()','AB.toLowerCase()','AB.substring(1,AB.length)','AB.split("a", 3)','AB.slice(1,AB.length)','AB.match("/a/g")','AB.constructor'],],
    ['boolean',
        [true,false,'true','false'],
        ['AB','AB.toString()','AB.valueOf()','AB.constructor']],
    ['object',
        ['{"1":1}','{"1":"1"}','{"a":1}','{"a":"123344"}','{"a":[123,321,"123"]}','{asd:"123"}','{"0.1":"321"}','{true1:"hellow"}','{"asd":["asd"]}','{"0":[{a1:2}]}','{"{1:1}":{a2:2}}','{"321":123}','{"1.32":1.99}','{"hell ":1243}','{"qwe":1231}','{a123:"1231"}','{a1:[{s1:2},{"2":"1"},"123",321]}',],
        ['AB','AB.toString()','AB.constructor']],
    ['function',
        ['function(a){return a}','function(){return 1}','function(){console.log("Function : auto ")}','function(a){console.log("Function : auto :" + a)}',],
        ['AB','AB.toString()','AB.constructor']],
    ['array',
        ['[1,2,3,4]','["1","2","3","4"]','[1,"2",3,"4"]','[[1,2.3,4],1,"2"]','[{m1:"123"},{"a":123}]','[1.1,"1.1"]','[[123]]','[true,1,"swsws"]','[function(){return 1},function(){return 1}]','[{n1:[1,2]}]','[1,2,3,4,5,6,7,8,9,10]',],
        ['AB','AB.join(" JSData ")','AB.pop()','AB.push(" JSData ")','AB.reverse()','AB.shift()','AB.slice(0,AB.length)','AB.sort()','AB.splice(0,2,"Lemon","Kiwi")','AB.unshift("Lemon","Pineapple")','AB.indexOf("a")','AB.lastIndexOf("a")']],//,'AB.reduce(getSum)','AB.reduceRight(getSum)'
    //['date',[],[]],
    //['regexp',['getRegExp("x", "img")','getRegExp("e", "i")','getRegExp("a", "")'],['AB','AB.toString()','AB.test("The best things in life are free")','AB.exec("The best things in life are free")']]
    ]

var operators = ['+',"-","*","/"]

var JSFunctionName = [
    'js_BoC',
    ]

var WXSFunction = [
    'function(a){console.log("WXSFunction :" + a + " Num:" + GlobalNum);GlobalNum++;return a}',
    'function(a){console.log("WXSFunction :" + a + " Num:" + GlobalNum);GlobalNum++;return GlobalNum}',
    'function(a){console.log("WXSFunction :" + a + " Num:" + GlobalNum);GlobalNum++;return GlobalString =+ "a"}',
    'function(a){console.log("WXSFunction :" + a + " Num:" + GlobalNum);GlobalNum++;return GlobalString + a}',
    'function(a){console.log("WXSFunction :" + a + " Num:" + GlobalNum);GlobalNum++;return GlobalNum + a}',
    'function(a){console.log("WXSFunction :" + a + " Num:" + GlobalNum);GlobalNum++;return "GlobalNum + a"}',
    ]

var T4String = function(moudl4,DataS){
    if (moudl4 == 0) return DataS
        else return 'MT.f' 
}

var T3type = function(moudl3){
    if (moudl3 == 2) return 1
        else return 0
}

var T2 = function(moudl2) {
    if (moudl2 == 2) return Math.floor(Math.random() * 2);
    else return moudl2
}

var AddAPI = function(Api,DataFrom,DataNum) {
    let pattern = /AB/g;
    return Api.replace(pattern, DataName[DataFrom] + DataNum)
};
module.exports = {
  DataTypes,
  AddAPI,
  operators,
  T4,
  T4String,
  T3,
  T3type,
  T2,
  T1,
  WXSFunction,
  DataName
};
