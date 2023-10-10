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
const restrictionButton = document.getElementById("restricton-setter");
if (restrictionButton)
    restrictionButton.addEventListener("click", () => {
        chrome.tabs.create({ url: "initial_setup.html" });
    });
function millisecondsToTime(duration) {
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return hours + ":" + minutes + ":" + seconds;
}
function getHostname() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs.length > 0) {
                const tabUrl = tabs[0].url;
                if (tabUrl) {
                    const tabHostname = new URL(tabUrl).hostname;
                    console.log(tabHostname);
                    resolve(tabHostname);
                }
                else {
                    resolve("Tab URL not found");
                }
            }
            else {
                console.log("No active tabs found.");
                reject("No active tabs found.");
            }
        });
    });
}
const getTimer = () => __awaiter(void 0, void 0, void 0, function* () {
    const timerElem = document.getElementById("timer");
    let currUrl = yield getHostname();
    currUrl = currUrl.replace("www.", "");
    console.log(currUrl);
    const res = yield chrome.storage.sync.get(["timer"]);
    const { timer } = res;
    console.log(res);
    let usedTime = (timer && timer[currUrl]) || 0;
    let currentTime = 0;
    if (timerElem) {
        setInterval(() => {
            timerElem.innerHTML = millisecondsToTime(usedTime + currentTime);
            currentTime += 1000;
        }, 1000);
    }
    else {
        console.log("Timer element not found");
    }
});
getTimer();
const reportsButton = document.getElementById("report-btn");
if (reportsButton)
    reportsButton.addEventListener("click", () => {
        chrome.tabs.create({ url: 'report.html' });
    });
