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
const getRestrictions = () => __awaiter(void 0, void 0, void 0, function* () {
    const restrictionListElem = document.getElementById("restrictions-list");
    if (restrictionListElem) {
        const res = yield chrome.storage.local.get(["restrictions"]);
        const previousRestrictions = res.restrictions;
        if (previousRestrictions && previousRestrictions.length) {
            console.log(previousRestrictions);
            for (const restriction of previousRestrictions) {
                const { url, time } = restriction;
                restrictionListElem.innerHTML += `
                    <li class="my-2 restrictions-list-point">
                        <span class="restriction-url">${url}</span>
                        <input type="time" class="mx-3 restriction-time" value="${time}">
                    </li>
                    `;
            }
        }
    }
    else {
        console.log("Restrictions list element not found");
    }
});
getRestrictions();
const addRestrictionForm = document.getElementById("add-restriction-form");
if (addRestrictionForm) {
    addRestrictionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("restriction-input");
        const list = document.getElementById("restrictions-list");
        if (list && input) {
            list.innerHTML += `
            <li class="my-2 restrictions-list-point">
                <span class="restriction-url">${input.value}</span>
                <input type="time" class="mx-3 restriction-time" value="00:00">
            </li>
            `;
            input.value = "https://";
        }
        else {
            console.log("list or input element not found");
        }
    });
}
else
    console.log("Restrictions form not found");
const saveRestrictionsBtn = document.getElementById("save-restrictions-btn");
if (saveRestrictionsBtn) {
    saveRestrictionsBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        const restrictionList = document.querySelectorAll(".restrictions-list-point");
        const restrictions = [];
        for (const restriction of restrictionList) {
            const urlElem = restriction.querySelector(".restriction-url");
            const url = urlElem === null || urlElem === void 0 ? void 0 : urlElem.innerHTML;
            const timeElem = restriction.querySelector(".restriction-time");
            const time = timeElem === null || timeElem === void 0 ? void 0 : timeElem.value;
            restrictions.push({ url, time });
        }
        console.log(restrictions);
        yield chrome.storage.local.set({ restrictions });
        window.alert("Your restrictions have been setup. Click OK to close this tab.");
        window.close();
    }));
}
else {
    console.log("Restrictions btn not found");
}
