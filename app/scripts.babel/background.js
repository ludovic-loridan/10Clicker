'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.onClicked.addListener(function(tab) {
  // Todo : check if execute script is needed
  chrome.tabs.executeScript({file: 'scripts/app/app.js'});
  chrome.tabs.insertCSS({file: 'styles/app.css'});
});