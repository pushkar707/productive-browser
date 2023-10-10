console.log("REFdxfzcedsx");
const getReports = async()  => {
    const res = await chrome.storage.sync.get(['timer'])
    const timer = JSON.stringify(res.timer)
    const reportsElem = document.getElementById("reports")
    if(reportsElem)
        reportsElem.innerHTML = timer
}

getReports()