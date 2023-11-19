console.log("REFdxfzcedsx");
const getReports = async()  => {
    const res = await chrome.storage.local.get(['timer','oldTimer'])
    const timer = JSON.stringify(res.timer)
    const oldTimer = JSON.stringify(res.oldTimer)
    const reportsElem = document.getElementById("reports")
    if(reportsElem)
        reportsElem.innerHTML = timer + '<br><br>'
    const oldReportsElem = document.getElementById("oldReports")
    if(oldReportsElem){
        oldReportsElem.innerHTML = oldTimer + '<br><br>'
    }
}

getReports()