// Require Firefox 17
const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;
Cu.import("resource://gre/modules/Services.jsm");

var
  manager = Services.cookies,
  prompter = Services.prompt,
  hostname = gBrowser.currentURI.host,
  cookies = manager.getCookiesFromHost(hostname),
  cookie,
  killed = [];

while (cookies.hasMoreElements()) {
  cookie = cookies.getNext().QueryInterface(Ci.nsICookie2);
  if (cookie.rawHost === hostname || hostname.endsWith('.' + cookie.rawHost)) {
    killed.push(cookie.name);
    manager.remove(
      cookie.host,
      cookie.name,
      cookie.path,
      false
    );
  }
}

if (killed.length) {
  prompter.alert(
    null,
    'FireGestures script',
    '已移除 ' + killed.length + " 個 cookie。\n\n主機：" + hostname + "\n名稱：" + killed.join("、")
  );
} else {
  prompter.alert(
    null,
    'FireGestures script',
    "沒有要移除的 cookie 了。\n\n主機：" + hostname
  );
}
