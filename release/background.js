chrome.tabs.onUpdated.addListener(function
    (tabId, changeInfo, tab) {
      
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        
        //Asset page script
        if (changeInfo.url && url.includes('opensea.io/assets/ethereum')) {
            setTimeout(function(){
            chrome.scripting.executeScript({
                target: {tabId: tabId, allFrames: true},
                files: ['asset-content-script.js'],
            })}, 1000);
        }

        //Collection page script
        if (changeInfo.url && url.includes('opensea.io/collection/impostors')) {
            setTimeout(function(){
            chrome.scripting.executeScript({
                target: {tabId: tabId, allFrames: true},
                files: ['collection-content-script.js'],
            })}, 1000);
        }
    });
});