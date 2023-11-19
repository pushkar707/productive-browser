
const getRestrictions = async() => {
    
    const restrictionListElem = document.getElementById("restrictions-list")
    if(restrictionListElem){
        const res = await chrome.storage.local.get(["restrictions"])
        const previousRestrictions = res.restrictions
        if (previousRestrictions && previousRestrictions.length){
            console.log(previousRestrictions);
            for (const restriction of previousRestrictions){
                const {url,time} = restriction
                    restrictionListElem.innerHTML += `
                    <li class="my-2 restrictions-list-point">
                        <span class="restriction-url">${url}</span>
                        <input type="time" class="mx-3 restriction-time" value="${time}">
                    </li>
                    `
            }
        }
    }else{
        console.log("Restrictions list element not found");
        
    }
}

getRestrictions()

const addRestrictionForm = document.getElementById("add-restriction-form")
if(addRestrictionForm){
    addRestrictionForm.addEventListener("submit",(e) => {
        e.preventDefault()
        const input = document.getElementById("restriction-input") as HTMLInputElement
        const list = document.getElementById("restrictions-list")
        if(list && input){
            list.innerHTML += `
            <li class="my-2 restrictions-list-point">
                <span class="restriction-url">${input.value}</span>
                <input type="time" class="mx-3 restriction-time" value="00:00">
            </li>
            `
            input.value = "https://"
        }else{
            console.log("list or input element not found");
        }
    })
}else
    console.log("Restrictions form not found");    


const saveRestrictionsBtn = document.getElementById("save-restrictions-btn")
if(saveRestrictionsBtn){
    saveRestrictionsBtn.addEventListener("click" , async() => {
        const restrictionList = document.querySelectorAll(".restrictions-list-point")
        const restrictions = []
        for (const restriction of restrictionList) {
            const urlElem = restriction.querySelector(".restriction-url")
            const url = urlElem?.innerHTML
            const timeElem = restriction.querySelector(".restriction-time") as HTMLInputElement
            const time = timeElem?.value
            restrictions.push({url,time})
        }
        console.log(restrictions);
        await chrome.storage.local.set({restrictions})
        window.alert("Your restrictions have been setup. Click OK to close this tab.")
        window.close()
    })  
}else{
    console.log("Restrictions btn not found");
}