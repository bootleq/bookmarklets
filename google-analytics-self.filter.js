if (typeof(_gaq) === 'undefined' ) {
  alert("無法在這個網頁運作（找不到 _gaq 物件），抱歉。");
} else {
  var v = prompt("請輸入要用於「篩選器模式」的字串：", "test_value");
  if (v !== null) {
    // See: https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingCustomVariables
    _gaq.push(['_setCustomVar', 1, 'ex', v, 1]);
    alert([
      "已設定 cookie: " + v,
      "SCRIPT: " + "_gaq.push(['_setCustomVar', 1, 'ex', " + v + ", 1]);"
    ].join("\n"));
  }
}
