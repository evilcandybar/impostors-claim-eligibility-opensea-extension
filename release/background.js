chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {

    chrome.scripting.executeScript({
        target: {tabId: details.tabId, allFrames: true},
        files: ['content-script.js'],
    });
});