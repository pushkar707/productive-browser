const tabLastHostnames : {[key: number] : string} = {}; // Initialize an object to store last hostnames for each tab
let start_time_bg = Date.now()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.resetTime) {
        start_time_bg = Date.now()
    }
    if(message.tabChanged) {
        chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
            if(tabs.length){
                try{
                    const tabId = tabs[0].id; // Get the tabId of the active tab
                    const tabUrl = tabs[0].url; // Get the URL of the active tab
                    console.log(tabUrl);
                    if(tabUrl){
                        const tabHostname = new URL(tabUrl).hostname; // Extract the hostname/domain from the URL
                        console.log(tabHostname);
                        // Send the tabId and hostname back to the content script or other parts of the extension
                        await chrome.storage.sync.set({closedTab:{'currentHostname':tabHostname,tabId}})
                    }
                }catch{
                    console.log("NOT VALID URL");
                }
            }
                
        });
    }
  });

chrome.tabs.onUpdated.addListener(async(tabId, changeInfo, tab) => {
    if (changeInfo.url) {
    const currentHostname = new URL(changeInfo.url).hostname
    console.log(currentHostname);
    await chrome.storage.sync.set({closedTab:{currentHostname,tabId}})
    const lastHostname = tabLastHostnames[tabId];

    if (lastHostname !== undefined && lastHostname !== currentHostname) { 

        const res1 = await chrome.storage.sync.get(["timer"])
        let myTimer = res1.timer || {}
        let currWebsite = lastHostname.replace("www.","")
        if(myTimer[currWebsite]){
            myTimer[currWebsite] += Date.now() - start_time_bg
        }else{
            myTimer[currWebsite] = Date.now() - start_time_bg
        }
        await chrome.storage.sync.set({"timer":myTimer})
        const res2 = await chrome.storage.sync.get(['timer'])
        console.log(res2.timer);
    }
    start_time_bg = Date.now()
    tabLastHostnames[tabId] = currentHostname; // Update lastHostname for the current tab
  }
});

chrome.tabs.onRemoved.addListener(async(tabId,removeInfo) => {
    const res = await chrome.storage.sync.get(['closedTab'])
    let currWebsite = res.closedTab.currentHostname
    currWebsite = currWebsite.replace("www.","")
    // let closedTabId = res.closedTab.tabId
    const res1 = await chrome.storage.sync.get(["timer"])
    let myTimer = res1.timer || {}
    if(myTimer[currWebsite]){
        myTimer[currWebsite] += Date.now() - start_time_bg
    }else{
        myTimer[currWebsite] = Date.now() - start_time_bg
    }

    await chrome.storage.sync.set({"timer":myTimer})
    await chrome.storage.sync.remove('closedTab')
    const res2 = await chrome.storage.sync.get(['timer'])
    console.log(res2.timer);
    start_time_bg = Date.now()
})