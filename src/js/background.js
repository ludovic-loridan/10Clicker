import '../img/icon-128.png'
import '../img/icon-34.png'

chrome.browserAction.onClicked.addListener(function (tab) {
  // Todo : check if execute script is needed
  chrome.tabs.executeScript({file: 'app.bundle.js'});
});