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
const tabLastHostnames = {};
let start_time_bg = Date.now();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.resetTime) {
        start_time_bg = Date.now();
    }
    if (message.tabChanged) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            return __awaiter(this, void 0, void 0, function* () {
                if (tabs.length) {
                    try {
                        const tabId = tabs[0].id;
                        const tabUrl = tabs[0].url;
                        console.log(tabUrl);
                        if (tabUrl) {
                            const tabHostname = new URL(tabUrl).hostname;
                            console.log(tabHostname);
                            yield chrome.storage.sync.set({ closedTab: { 'currentHostname': tabHostname, tabId } });
                        }
                    }
                    catch (_a) {
                        console.log("NOT VALID URL");
                    }
                }
            });
        });
    }
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => __awaiter(void 0, void 0, void 0, function* () {
    if (changeInfo.url) {
        const currentHostname = new URL(changeInfo.url).hostname;
        console.log(currentHostname);
        yield chrome.storage.sync.set({ closedTab: { currentHostname, tabId } });
        const lastHostname = tabLastHostnames[tabId];
        if (lastHostname !== undefined && lastHostname !== currentHostname) {
            const res1 = yield chrome.storage.sync.get(["timer"]);
            let myTimer = res1.timer || {};
            let currWebsite = lastHostname.replace("www.", "");
            if (myTimer[currWebsite]) {
                myTimer[currWebsite] += Date.now() - start_time_bg;
            }
            else {
                myTimer[currWebsite] = Date.now() - start_time_bg;
            }
            yield chrome.storage.sync.set({ "timer": myTimer });
        }
        start_time_bg = Date.now();
        tabLastHostnames[tabId] = currentHostname;
    }
}));
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield chrome.storage.sync.get(['closedTab', 'timer']);
    let currWebsite = res.closedTab.currentHostname;
    currWebsite = currWebsite.replace("www.", "");
    let myTimer = res.timer || {};
    if (myTimer[currWebsite]) {
        myTimer[currWebsite] += Date.now() - start_time_bg;
    }
    else {
        myTimer[currWebsite] = Date.now() - start_time_bg;
    }
    yield chrome.storage.sync.set({ "timer": myTimer });
    yield chrome.storage.sync.remove('closedTab');
    start_time_bg = Date.now();
}));
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield chrome.storage.sync.get(['lastDate']);
    const currentDate = new Date().toDateString();
    const lastDate = res['lastDate'];
    if (!lastDate) {
        yield chrome.storage.sync.set({ 'lastDate': currentDate });
    }
    else {
        if (currentDate !== lastDate) {
            const res = yield chrome.storage.sync.get(['oldTimer', "timer"]);
            let oldTimer = res.oldTimer || [];
            let timer = res.timer || {};
            oldTimer.push(timer);
            console.log(oldTimer);
            yield chrome.storage.sync.set({ 'lastDate': currentDate, "timer": {}, oldTimer });
        }
    }
}), 3600000);
