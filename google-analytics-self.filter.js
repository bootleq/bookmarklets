if(typeof(_gat)=='undefined'){
  alert("無法在這個網頁運作（我們找不到 _gat），抱歉。");
  return;
}
var leqTracker = _gat._getTracker();
if(leqTracker){
  var v=prompt("請輸入要用於「篩選器模式」的字串：","test_value");
  if(v!=null){
    leqTracker._setVar(v);
    alert("已設定 cookie: "+v);
  }
}
