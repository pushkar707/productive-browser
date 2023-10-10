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
const recordNewTab = () => __awaiter(void 0, void 0, void 0, function* () {
    const tabHostname = window.location.hostname;
    yield chrome.storage.sync.set({ closedTab: { 'currentHostname': tabHostname, tabId: 0 } });
    console.log("hostname saved");
});
recordNewTab();
function timeToMilliseconds(time) {
    const [hoursStr, minutesStr] = time.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (isNaN(hours) || isNaN(minutes)) {
        return 0;
    }
    const totalMilliseconds = (hours * 60 + minutes) * 60 * 1000;
    return totalMilliseconds;
}
if (window.location.hostname === "www.youtube.com") {
    setInterval(() => {
        const shortsButton = document.querySelectorAll("ytd-guide-entry-renderer")[1];
        shortsButton && shortsButton.innerText == "Shorts" && shortsButton.remove();
        const shortsSections = document.querySelectorAll("ytd-rich-section-renderer");
        if (shortsSections) {
            for (const section of shortsSections) {
                section.style.display = "none";
            }
        }
        const shortsSectionsSearch = document.querySelectorAll("ytd-reel-shelf-renderer");
        if (shortsSections) {
            for (const section of shortsSectionsSearch) {
                section.style.display = "none";
            }
        }
    }, 2500);
}
const closeRestrictedApps = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield chrome.storage.sync.get("restrictions");
    const { restrictions } = res;
    let currWebsite = window.location.hostname;
    currWebsite = currWebsite.replace("www.", "");
    const tiimelyRestricted = [];
    const completerestrictedWebsites = restrictions.map((rest) => {
        let url = rest.url;
        let time = rest.time;
        url = url.replace("https://www.", "");
        url = url.replace("https://", "");
        if (time == '00:00') {
            return url;
        }
        tiimelyRestricted.push({ url, time });
        return undefined;
    });
    if (completerestrictedWebsites.includes(currWebsite)) {
        document.body.innerHTML = `You cannot use this website. You have restricted its usage`;
    }
    const curr_obj = tiimelyRestricted.find(rest => rest.url == currWebsite);
    if (curr_obj) {
        console.log("Hello first time visitor");
        let firstTime = 0;
        const res = yield chrome.storage.sync.get(['timer']);
        const timer = res.timer || {};
        let firstTimeInterval = setInterval(() => {
            const firstTimeUsed = (timer[currWebsite] || 0) + firstTime;
            console.log(firstTimeUsed);
            if (firstTimeUsed > timeToMilliseconds(curr_obj.time)) {
                document.body.innerHTML = `You cannot use this website. You have restricted its usage`;
            }
            firstTime += 1000;
        }, 1000);
        let intervalId;
        let currentTime = 0;
        document.addEventListener("visibilitychange", () => __awaiter(void 0, void 0, void 0, function* () {
            if (document.hidden) {
                clearInterval(intervalId);
                clearInterval(firstTimeInterval);
                currentTime = 0;
            }
            else {
                const res = yield chrome.storage.sync.get(['timer']);
                const timer = res.timer || {};
                intervalId = setInterval(() => {
                    const timeUsed = (timer[currWebsite] || 0) + currentTime;
                    console.log(timeUsed);
                    console.log(timeToMilliseconds(curr_obj.time));
                    if (timeUsed > timeToMilliseconds(curr_obj.time)) {
                        document.body.innerHTML = `You cannot use this website. You have restricted its usage`;
                    }
                    currentTime += 1000;
                }, 1000);
            }
        }));
    }
});
closeRestrictedApps();
let start_time = Date.now();
const updateTimer = (currWebsite = window.location.hostname) => __awaiter(void 0, void 0, void 0, function* () {
    const end_time = Date.now();
    const res1 = yield chrome.storage.sync.get(["timer"]);
    let myTimer = res1.timer || {};
    console.log(res1.timer, "Time: " + (new Date()).toLocaleTimeString());
    currWebsite = currWebsite.replace("www.", "");
    console.log(currWebsite);
    if (myTimer[currWebsite]) {
        myTimer[currWebsite] += end_time - start_time;
    }
    else {
        myTimer[currWebsite] = end_time - start_time;
    }
    yield chrome.storage.sync.set({ "timer": myTimer });
});
document.addEventListener("visibilitychange", () => __awaiter(void 0, void 0, void 0, function* () {
    if (document.hidden) {
        updateTimer();
        chrome.runtime.sendMessage({ tabChanged: true });
    }
    else {
        start_time = Date.now();
        chrome.runtime.sendMessage({ resetTime: true });
    }
}));
