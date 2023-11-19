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
console.log("REFdxfzcedsx");
const getReports = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield chrome.storage.local.get(['timer', 'oldTimer']);
    const timer = JSON.stringify(res.timer);
    const oldTimer = JSON.stringify(res.oldTimer);
    const reportsElem = document.getElementById("reports");
    if (reportsElem)
        reportsElem.innerHTML = timer + '<br><br>';
    const oldReportsElem = document.getElementById("oldReports");
    if (oldReportsElem) {
        oldReportsElem.innerHTML = oldTimer + '<br><br>';
    }
});
getReports();
