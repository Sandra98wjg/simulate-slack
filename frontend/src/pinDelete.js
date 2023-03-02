// this js is main to pin and unpin and delete message
// pin and unpin message
function pinMessage(messageId) {
    let color = document.getElementById(messageId).style.backgroundColor
    if (color === "") {
        sendPin(messageId)

    }
    else {
        sendUnPin(messageId)
    }
}

// send pin message
function sendPin(messageId) {
    fetch(`http://127.0.0.1:${BACKEND_PORT}/message/pin/${localStorage.getItem("nowChannelId")}/${messageId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json()
                    .then(data => {
                        document.getElementById(messageId).style.backgroundColor = "#f3e8bc"
                        document.getElementById(`pin${messageId}`).style.display = "block"
                    })
            }
            else {
                res.json().then(data => {
                    errorMsg(data.error, "single-channel-part")
                })
            }
        })
        .catch(e => errorMsg('error', "single-channel-part"))
}
// send unpin message
function sendUnPin(messageId) {
    fetch(`http://127.0.0.1:${BACKEND_PORT}/message/unpin/${localStorage.getItem("nowChannelId")}/${messageId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json()
                    .then(data => {
                        document.getElementById(messageId).style.backgroundColor = ""
                        document.getElementById(`pin${messageId}`).style.display = "none"
                    })
            }
            else {
                res.json().then(data => {
                    errorMsg(data.error, "single-channel-part")
                })
            }
        })
        .catch(e => errorMsg('error', "single-channel-part"))
}

// add pin message to pin total
function addToPinTotal(id, sendTime, message, messageId, edited, editedAt, isImage) {
    // get name and avatar
    userName = userInfos.get(id).name
    userImg = userInfos.get(id).image ? userInfos.get(id).image : defaultImg
    let sendDate = new Date(sendTime).toLocaleString()
    // the message total
    const pinMessageTotal = document.createElement('div')
    pinMessageTotal.setAttribute("class", "single-messages")
    pinMessageTotal.id = `pin-message${messageId}`
    // message avatar part
    const pinMessageAvatar = document.createElement('div')
    pinMessageAvatar.setAttribute("class", "single-messages-avatar")
    const pinMessageAvatarImg = document.createElement('img')
    pinMessageAvatarImg.setAttribute("class", "user-avatar")
    pinMessageAvatarImg.src = `${userImg}`
    pinMessageAvatar.appendChild(pinMessageAvatarImg)
    pinMessageTotal.appendChild(pinMessageAvatar)
    // message title and content
    // message sender name
    const pinMessageText = document.createElement('div')
    const pinMessageTextTitle = document.createElement('h6')
    pinMessageTextTitle.setAttribute("class", "pin-name-time")
    pinMessageTextTitle.textContent = `${userName}`
    // message send time
    const pinMessageTextTime = document.createElement('span')
    pinMessageTextTime.setAttribute("class", "name-time-span")
    pinMessageTextTime.textContent = `${sendDate}`
    pinMessageTextTitle.appendChild(pinMessageTextTime)
    pinMessageText.appendChild(pinMessageTextTitle)
    // message content
    const pinMessageTextContent = document.createElement('p')
    pinMessageTextContent.setAttribute("class", "pin-single-messages-text")
    // if is message
    if (!isImage) {
        const pinMessageTextMessage = document.createElement('span')
        pinMessageTextMessage.textContent = `${message}`
        pinMessageTextContent.appendChild(pinMessageTextMessage)
    }
    else {
        const pinMessageTextMessage = document.createElement('img')
        pinMessageTextMessage.setAttribute("class", "message-image")
        pinMessageTextMessage.src = `${message}`
        pinMessageTextContent.appendChild(pinMessageTextMessage)
    }
    // if this message has been edited
    if (edited) {
        const pinMessageTextEdit = document.createElement('span')
        const editedTime = new Date(editedAt).toLocaleString()
        pinMessageTextEdit.textContent = `(edited at ${editedTime})`
        pinMessageTextContent.appendChild(pinMessageTextEdit)
    }
    pinMessageText.appendChild(pinMessageTextContent)
    pinMessageTotal.appendChild(pinMessageText)
    // add message to pin message page
    document.getElementById("pinned-messages-total").prepend(pinMessageTotal)
}

// for pin total page
// get message for the channel
function pinMessages(startId) {
    fetch(`http://127.0.0.1:${BACKEND_PORT}/message/${localStorage.getItem("nowChannelId")}?start=${startId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    for (message of data.messages) {
                        if (message.pinned) {
                            if (message.image === undefined) {
                                addToPinTotal(message.sender, message.sentAt, message.message, message.id, message.edited, message.editedAt, false)
                            }
                            else {
                                addToPinTotal(message.sender, message.sentAt, message.image, message.id, message.edited, message.editedAt, true)
                            }
                        }
                    }
                    if (data.messages.length === 25) {
                        pinMessages(startId + 25)
                    }
                })
            }
            else {
                res.json().then(data => {
                    errorMsg(data.error, "join-channel-part")
                })
            }
        })
        .catch(e => errorMsg('error', "join-channel-part"))
}
// click the button to show pin total
const channelPinnedMessage = document.getElementById("channel-pinned-message")
channelPinnedMessage.addEventListener("click", () => {
    document.getElementById("pinned-messages-total").textContent = ""
    pinMessages(0)
})

// delete message
function deleteMessage(messageId) {
    fetch(`http://127.0.0.1:${BACKEND_PORT}/message/${localStorage.getItem("nowChannelId")}/${messageId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    document.getElementById(messageId).remove()
                })
            }
            else {
                res.json().then(data => {
                    errorMsg(data.error, "single-channel-part")
                })
            }
        })
        .catch(e => errorMsg('error', "single-channel-part"))
}