const recordNewTab = async() => {
    const tabHostname = window.location.hostname
    await chrome.storage.local.set({closedTab:{'currentHostname':tabHostname,tabId:0}})
    console.log("hostname saved");
}
recordNewTab()
function timeToMilliseconds(time:string) {
    const [hoursStr, minutesStr] = time.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) {
        return 0; // Invalid input
    }

    const totalMilliseconds = (hours * 60 + minutes) * 60 * 1000;
    return totalMilliseconds;
}

if(window.location.hostname === "www.youtube.com"){
    setInterval(() => {
        const shortsButton = document.querySelectorAll("ytd-guide-entry-renderer")[1] as HTMLElement
        shortsButton && shortsButton.innerText == "Shorts" && shortsButton.remove()
        
        const shortsSections:NodeListOf<HTMLElement> = document.querySelectorAll("ytd-rich-section-renderer")
        if (shortsSections) { for (const section of shortsSections) {section.style.display = "none"}}
    
        const shortsSectionsSearch:NodeListOf<HTMLElement> = document.querySelectorAll("ytd-reel-shelf-renderer")
        if (shortsSections) { for (const section of shortsSectionsSearch) {section.style.display = "none"}}
    }, 2500)
}

const closeRestrictedApps = async () => {
    const res = await chrome.storage.local.get("restrictions")
    const {restrictions} = res
    let currWebsite = window.location.hostname
    currWebsite = currWebsite.replace("www.","")
    const tiimelyRestricted : {url:string,time:string}[] = []
    const completerestrictedWebsites = restrictions.map((rest:any) => {
        let url:string = rest.url
        let time:string = rest.time
        // let {url,time} = rest
        url = url.replace("https://www.","")
        url = url.replace("https://","")
        if(time == '00:00'){
            return url
        }
        tiimelyRestricted.push({url,time})
        return undefined
    })
    if(completerestrictedWebsites.includes(currWebsite)){
        document.body.innerHTML = `You cannot use this website. You have restricted its usage`
    }
    const curr_obj = tiimelyRestricted.find(rest => rest.url == currWebsite)
    if(curr_obj){
        console.log("Hello first time visitor");
        let firstTime = 0
        const res = await chrome.storage.local.get(['timer'])
        const timer = res.timer || {}
        let firstTimeInterval = setInterval(() => {
            const firstTimeUsed = (timer[currWebsite] || 0) + firstTime
            console.log(firstTimeUsed);
            if(firstTimeUsed > timeToMilliseconds(curr_obj.time)){
                document.body.innerHTML = `You cannot use this website. You have restricted its usage`
            }
            firstTime+=1000
        },1000)
        let intervalId : number
        let currentTime=0
        document.addEventListener("visibilitychange",async() => {
            if(document.hidden){
                clearInterval(intervalId)
                clearInterval(firstTimeInterval)
                currentTime = 0
            }else{
                const res = await chrome.storage.local.get(['timer'])
                const timer = res.timer || {}
                intervalId = setInterval(() => {
                const timeUsed = (timer[currWebsite] || 0) + currentTime
                console.log(timeUsed);
                console.log(timeToMilliseconds(curr_obj.time));
                if(timeUsed > timeToMilliseconds(curr_obj.time)){
                    document.body.innerHTML = `You cannot use this website. You have restricted its usage`
                }
                currentTime+=1000
                }, 1000);
            }
        } )
    }
}


closeRestrictedApps()

let start_time = Date.now()

const updateTimer = async(currWebsite=window.location.hostname) => {
    const end_time = Date.now()
    const res1 = await chrome.storage.local.get(["timer"])
    let myTimer = res1.timer || {}
    console.log(res1.timer, "Time: "+ (new Date()).toLocaleTimeString());
    currWebsite = currWebsite.replace("www.","")
    console.log(currWebsite);
    if(myTimer[currWebsite]){
        myTimer[currWebsite] += end_time - start_time
    }else{
        myTimer[currWebsite] = end_time - start_time
    }
    
    await chrome.storage.local.set({"timer":myTimer})
}




document.addEventListener("visibilitychange", async() => {
    if (document.hidden) {
       updateTimer()
       chrome.runtime.sendMessage({tabChanged:true})
    }else{
        // When we come back to out
        start_time = Date.now()
        chrome.runtime.sendMessage({resetTime:true})
    }
});