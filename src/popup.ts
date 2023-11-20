type MyHTMLElement = HTMLElement | null
const restrictionButton: MyHTMLElement = document.getElementById("restricton-setter")
if(restrictionButton)
    restrictionButton.addEventListener("click",() => {
        chrome.tabs.create({url: "initial_setup.html"})
    })



function getHostname() : Promise<string> {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs.length > 0) {
            const tabUrl:string | undefined = tabs[0].url;
            if(tabUrl){
                const tabHostname = new URL(tabUrl).hostname;
                console.log(tabHostname);
                resolve(tabHostname);
            }else{
                resolve("Tab URL not found")
            }
        } else {
            console.log("No active tabs found.");
            reject("No active tabs found.");
        }
        });
    });
}

const getTimer = async(): Promise<void> => {
    const timerElem : MyHTMLElement = document.getElementById("timer")
    let currUrl = await getHostname()
    currUrl = currUrl.replace("www.","")
    console.log(currUrl);
    
    const res = await chrome.storage.local.get(["timer"])
    const {timer} = res
    console.log(res);
    let usedTime : number = (timer && timer[currUrl]) || 0
    let currentTime = 0
    if(timerElem){
        setInterval(() => {
            timerElem.innerHTML = millisecondsToTime(usedTime+currentTime)
            currentTime+=1000
        }, 1000);
    }else{
        console.log("Timer element not found");        
    }
}

getTimer()

const reportsButton:MyHTMLElement = document.getElementById("report-btn")
if(reportsButton)
    reportsButton.addEventListener("click", () => {
        chrome.tabs.create({ url: 'report.html' });
    })