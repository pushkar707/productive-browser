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
                        await chrome.storage.local.set({closedTab:{'currentHostname':tabHostname,tabId}})
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
    await chrome.storage.local.set({closedTab:{currentHostname,tabId}})
    const lastHostname = tabLastHostnames[tabId];

    if (lastHostname !== undefined && lastHostname !== currentHostname) { 

        const res1 = await chrome.storage.local.get(["timer"])
        let myTimer = res1.timer || {}
        let currWebsite = lastHostname.replace("www.","")
        if(myTimer[currWebsite]){
            myTimer[currWebsite] += Date.now() - start_time_bg
        }else{
            myTimer[currWebsite] = Date.now() - start_time_bg
        }
        await chrome.storage.local.set({"timer":myTimer})
    }
    start_time_bg = Date.now()
    tabLastHostnames[tabId] = currentHostname; // Update lastHostname for the current tab
  }
});

chrome.tabs.onRemoved.addListener(async(tabId,removeInfo) => {
    const res = await chrome.storage.local.get(['closedTab','timer'])
    let currWebsite = res.closedTab && res.closedTab.currentHostname
    if(currWebsite){
        currWebsite = currWebsite.replace("www.","")
        // let closedTabId = res.closedTab.tabId
        let myTimer = res.timer || {}
        if(myTimer[currWebsite]){
            myTimer[currWebsite] += Date.now() - start_time_bg
        }else{
            myTimer[currWebsite] = Date.now() - start_time_bg
        }
    
        await chrome.storage.local.set({"timer":myTimer})
        await chrome.storage.local.remove('closedTab')
        start_time_bg = Date.now()
    }
})

// Detecting first startup of the day

// This interval will run in every 1hr to check for the new day, and reset the timer
setInterval(async() => {
    const res:{[key:string]:string} = await chrome.storage.local.get(['lastDate'])
    const currentDate:string = new Date().toDateString()
    console.log(currentDate);    
    const lastDate: string = res['lastDate']
    console.log(lastDate)
    if(!lastDate){
        await chrome.storage.local.set({'lastDate':currentDate})
    }else{
        if(currentDate !== lastDate){
            const res = await chrome.storage.local.get(['oldTimer',"timer"])
            let oldTimer: [{[key:string]:number}] = res.oldTimer || []
            let timer: {[key:string]:number} = res.timer || {}
            Object.keys(timer).forEach(site => {
                if(timer[site] < 5000){
                    delete timer[site]
                }
            })
            if(oldTimer.length >= 7){
                oldTimer.shift()
            }
            oldTimer.push(timer)
            console.log(oldTimer);
            await chrome.storage.local.set({'lastDate':currentDate,"timer":{},oldTimer})
        }
    }
    const res2 = await chrome.storage.local.get(['timer'])
    console.log(res2.timer);
},60000)