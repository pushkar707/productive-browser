const getReports = async()  => {
    const res = await chrome.storage.local.get(['timer','oldTimer'])
    const timer = res.timer
    const table = timerToTable(timer)
    const p = timePara()
    
    const reportsElem = document.getElementById("reports")
    if(reportsElem){
        reportsElem.append(p,table)
        // reportsElem.append(table)
    }

    const oldTimer = res.oldTimer
    const oldReportsElem = document.getElementById("oldReports")
    if(oldReportsElem){
        oldTimer.forEach((timer:{[key:string]:number},index:number) => {
            const table = timerToTable(timer)
            table.classList.add("mb-5")
            const p = timePara(index+1)
            oldReportsElem.append(p,table)
            // oldReportsElem.append(table)
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

const date = (when:number = 0) => {
    let date:Date | string = new Date()
    date.setDate(date.getDate() - when)
    date = date.toString()
    return date.slice(0,15)
}

const timePara = (when:number = 0) => {
    const p = document.createElement("p")
    p.classList.add("text-center","my-3")
    p.innerText = date(when)
    return p
}