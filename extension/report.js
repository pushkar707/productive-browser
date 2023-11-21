"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const getReports = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield chrome.storage.local.get(['timer', 'oldTimer']);
    const timer = res.timer;
    const table = timerToTable(timer);
    const p = timePara();
    const reportsElem = document.getElementById("reports");
    if (reportsElem) {
        reportsElem.append(p, table);
    }
    const oldTimer = res.oldTimer;
    const oldReportsElem = document.getElementById("oldReports");
    if (oldReportsElem) {
        oldTimer.forEach((timer, index) => {
            const table = timerToTable(timer);
            table.classList.add("mb-5");
            const p = timePara(index + 1);
            oldReportsElem.append(p, table);
        });
    }
});
getReports();
const timerToTable = (timer) => {
    const table = document.createElement("table");
    table.classList.add("table", "mx-auto", "w-75");
    table.innerHTML = `
    <thead>
        <tr>
            <th scope="col">Sno.</th>
            <th scope="col">Website</th>
            <th scope="col">Time Used</th>
        </tr>
    </thead>
    `;
    Object.keys(timer).forEach((site, index) => {
        table.insertAdjacentHTML("beforeend", `<tr>
            <td>${index + 1}</td>
            <td>${site}</td>
            <td>${millisecondsToTime(timer[site])}</td>
        </tr>`);
    });
    return table;
};
const date = (when = 0) => {
    let date = new Date();
    date.setDate(date.getDate() - when);
    date = date.toString();
    return date.slice(0, 15);
};
const timePara = (when = 0) => {
    const p = document.createElement("p");
    p.classList.add("text-center", "my-3");
    p.innerText = date(when);
    return p;
};
