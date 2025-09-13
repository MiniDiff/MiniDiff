var count = 0
var ReturnCount = function(string) {
  count ++ 
  console.log("Count :"  + count + ":" + string)
  return count
}
export default {
  ReturnCount
}