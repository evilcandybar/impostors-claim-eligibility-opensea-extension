chrome.tabs.onUpdated.addListener(function
    (tabId, changeInfo, tab) {
      if (changeInfo.url) {
        setTimeout(function(){
        chrome.scripting.executeScript({
            target: {tabId: tabId, allFrames: true},
            files: ['content-script.js'],
        })}, 1000);
      }
    }
  );