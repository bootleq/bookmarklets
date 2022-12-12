// Require Firefox 17
const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;
Cu.import("resource://gre/modules/Services.jsm");

var
  manager = Services.cookies,
  prompter = Services.prompt,
  hostname = gBrowser.currentURI.host,
  cookies = manager.getCookiesFromHost(hostname),
  cookie,
  dialogTitle = 'FireGestures script',
  kills = [];

while (cookies.hasMoreElements()) {
  cookie = cookies.getNext().QueryInterface(Ci.nsICookie2);
  if (cookie.rawHost === hostname || hostname.endsWith('.' + cookie.rawHost)) {
    kills.push(cookie);
  }
}


if (kills.length) {
  if (prompter.confirm(
        null,
        dialogTitle,
        [
          hostname,
          '移除 ' + kills.length + " 個曲奇？",
          "\n  " + kills.map(function (cookie) { return cookie.name; }).join("\n  ")
        ].join("\n")
      )) {
    kills.forEach(function (cookie) {
      manager.remove(
        cookie.host,
        cookie.name,
        cookie.path,
        false
      );
    });
    window.alert('已移除 ' + kills.length + " 個曲奇。");
  }
} else {
  prompter.alert(
    null,
    dialogTitle,
    hostname + "\n沒有需移除的曲奇。"
  );
}
