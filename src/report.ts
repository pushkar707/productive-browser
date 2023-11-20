const getReports = async()  => {
    const res = await chrome.storage.local.get(['timer','oldTimer'])
    const timer = res.timer
    const table = timerToTable(timer)
    
    const reportsElem = document.getElementById("reports")
    if(reportsElem)
        reportsElem.append(table)

    const oldTimer = res.oldTimer
    const oldReportsElem = document.getElementById("oldReports")
    if(oldReportsElem){
        oldTimer.forEach((timer:{[key:string]:number}) => {
            const table = timerToTable(timer)
            oldReportsElem.append(table)
        })
    }
}

getReports()

const timerToTable = (timer:{[key:string]:number}) => {
    const table = document.createElement("table")
    table.classList.add("table","mx-auto", "w-75")

    table.innerHTML = `
    <thead>
        <tr>
            <th scope="col">Sno.</th>
            <th scope="col">Website</th>
            <th scope="col">Time Used</th>
        </tr>
    </thead>
    `
    
    
    Object.keys(timer).forEach((site:any,index:number) => {
        table.insertAdjacentHTML( "beforeend",
        `<tr>
            <td>${index+1}</td>
            <td>${site}</td>
            <td>${millisecondsToTime(timer[site])}</td>
        </tr>`
        )        
    })

    return table
}