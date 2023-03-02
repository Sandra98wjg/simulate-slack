// this js is mainly on invite other users to channel
// invite users
const inviteChannelBtn = document.getElementById("invite-channel-btn")
inviteChannelBtn.addEventListener("click", () => {
    const userTotal = document.getElementById("invite-channel-users")
    userTotal.textContent = ""
    let userNameTotal = []
    showPage("invite-channel-part")
    for (user of userInfos) {
        if (user[0] !== Number(localStorage.getItem("userId"))) {
            userNameTotal.push([user[1].name, user[0]])
        }
    }
    userNameTotal.sort()
    for (user of userNameTotal) {
        const userList = document.createElement('div')
        const userBox = document.createElement('input')
        userBox.setAttribute("type", "checkbox")
        userBox.setAttribute("name", "userName")
        userBox.setAttribute("value", `${user[1]}`)
        const userBoxLabel = document.createElement('label')
        userBoxLabel.setAttribute("for", "userName")
        const userBoxName = document.createElement("h5")
        userBoxName.textContent = `${user[0]}`
        userBoxLabel.appendChild(userBoxName)
        const userBoxBr = document.createElement("br")
        userList.appendChild(userBox)
        userList.appendChild(userBoxLabel)
        userList.appendChild(userBoxBr)
        userTotal.appendChild(userList)
    }
})

// comfirm invite other users
const inviteChannelSubmitBtn = document.getElementById("invite-channel-submit-btn")
inviteChannelSubmitBtn.addEventListener("click", () => {
    const inviteUsers = document.getElementsByName("userName")
    for (let i = 0; i < inviteUsers.length; i++) {
        if (inviteUsers[i].checked) {
            inviteEachUser(Number(inviteUsers[i].value))
        }
    }
    showPage("single-channel-part")
})

// invite other users
function inviteEachUser(userId) {
    let postMessage = {
        "userId": userId
    }
    fetch(`http://127.0.0.1:${BACKEND_PORT}/channel/${localStorage.getItem("nowChannelId")}/invite`, {
        method: 'POST',
        body: JSON.stringify(postMessage),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json()
            }
        })
        .catch(e => errorMsg('error', "single-channel-part"))
}