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
    const reportsElem = document.getElementById("reports");
    if (reportsElem)
        reportsElem.append(table);
    const oldTimer = res.oldTimer;
    const oldReportsElem = document.getElementById("oldReports");
    if (oldReportsElem) {
        oldTimer.forEach((timer) => {
            const table = timerToTable(timer);
            oldReportsElem.append(table);
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
