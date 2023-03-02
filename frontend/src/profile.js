// this is is main to load and modify profile
// click to show userself profile
const toUserProfile = document.getElementById("to-user-profile")
toUserProfile.addEventListener("click", () => {
    toUserProfiles(Number(localStorage.getItem("userId")))
})
// to user profile
function toUserProfiles(userId) {
    showPage("user-profile-part")
    document.getElementById("modify-profile-btn").style.display = "none"
    fetch(`http://127.0.0.1:${BACKEND_PORT}/user/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    // check if userImg and bio is null
                    userImg = data.image ? data.image : defaultImg
                    const bio = data.bio ? data.bio : " "
                    document.getElementById("userImg").src = `${userImg}`
                    document.getElementById("userName").textContent = `User Name: ${data.name}`
                    document.getElementById("userBio").textContent = `User Bio: ${bio}`
                    document.getElementById("userEmail").textContent = `User Email: ${data.email}`
                    // modify button   
                    if (userId === Number(localStorage.getItem("userId"))) {
                        document.getElementById("modify-profile-btn").style.display = "inline-block"
                        document.getElementById("log-out-btn").style.display = "inline-block"
                    }
                })
            }
            else {
                res.json().then(data => {
                    errorMsg(e=>data.error, "user-profile-part")
                })
            }
        })
        .catch(e => errorMsg('error', "user-profile-part"))
}
// userself profile modify
const modifyProfileBtn = document.getElementById("modify-profile-btn")
modifyProfileBtn.addEventListener("click", () => {
    showPage("modify-proflie-part")
})
// submit new userself profile
const newProfileSubmitBtn = document.getElementById("new-profile-submit-btn")
newProfileSubmitBtn.addEventListener("click", () => {
    const name = document.getElementById("user-new-name").value
    const bio = document.getElementById("user-new-bio").value
    const email = document.getElementById("user-new-email").value
    const password = document.getElementById("user-new-password").value
    // if user put image
    if (document.getElementById("user-new-image").files[0] !== undefined) {
        fileToDataUrl(document.getElementById("user-new-image").files[0])
            .then(data => {
                let postMessage = {
                    "email": email,
                    "password": password,
                    "name": name,
                    "bio": bio,
                    "image": data
                }
                fetch(`http://127.0.0.1:${BACKEND_PORT}/user`, {
                    method: 'PUT',
                    body: JSON.stringify(postMessage),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    }
                })
                    .then(res => {
                        if (res.status === 200) {
                            res.json().then(data => {
                                showPage("channel-welcome-part")
                            }).then(setUserInfo(Number(localStorage.getItem("userId"))))
                        }
                        else {
                            res.json().then(data => {
                                errorMsg(data.error, "modify-proflie-part")
                            })
                        }
                    })
                    .catch(e => errorMsg('error', "modify-proflie-part"))
            })
    }
    else {
        // if user didn't put image
        let postMessage = {
            "email": email,
            "password": password,
            "name": name,
            "bio": bio,
            "image": ""
        }
        fetch(`http://127.0.0.1:${BACKEND_PORT}/user`, {

            method: 'PUT',
            body: JSON.stringify(postMessage),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        showPage("channel-welcome-part")
                    }).then(setUserInfo(Number(localStorage.getItem("userId"))))
                }
                else {
                    res.json().then(data => {
                        errorMsg(data.error, "modify-proflie-part")
                    })
                }
            })
            .catch(e => errorMsg('error', "modify-proflie-part"))
    }
    document.getElementById("user-new-email").value = ''
    document.getElementById("user-new-password").value = ''
    document.getElementById("user-new-name").value = ''
    document.getElementById("user-new-bio").value = ''
    document.getElementById("user-new-image").value = ''
})

// log out from this user
const logOutBtn = document.getElementById("log-out-btn")
logOutBtn.addEventListener("click", () => {
    fetch(`http://127.0.0.1:${BACKEND_PORT}/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json().then(data=>{
                    document.getElementById("login-page").style.display = "block"
                    document.getElementById("channels-page").style.display = "none"
                    document.getElementById("user-profile-part").style.display = "none"
                    localStorage.clear()
                })
            }
            else {
                res.json().then(data => {
                    errorMsg(e=>data.error, "user-profile-part")
                })
            }
        })
        .catch(e => errorMsg('error', "user-profile-part"))
})
