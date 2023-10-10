console.log("REFdxfzcedsx");
const getReports = async()  => {
    const res = await chrome.storage.sync.get(['timer','oldTimer'])
    const timer = JSON.stringify(res.timer)
    const oldTimer = JSON.stringify(res.oldTimer)
    const reportsElem = document.getElementById("reports")
    if(reportsElem)
        reportsElem.innerHTML = timer
    const oldReportsElem = document.getElementById("oldResports")
    if(oldReportsElem){
        oldReportsElem.innerHTML = oldTimer
    }
}

getReports()