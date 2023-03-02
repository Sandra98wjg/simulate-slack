// this js is main for send message and image at channel

// change text type
const chooseMessageType = document.getElementById("choose-message-type")
chooseMessageType.addEventListener("change", () => {
    if (chooseMessageType.value === "Text") {
        document.getElementById("send-message-text").style.display = "block"
        document.getElementById("send-message-image").style.display = "none"
    }
    else {
        document.getElementById("send-message-text").style.display = "none"
        document.getElementById("send-message-image").style.display = "block"
    }
    // after change, clean all inout
    document.getElementById("send-message-btn").disabled = true
    document.getElementById("send-message-text").value = ''
    document.getElementById("send-message-image").value = ''
})

// check if message is null or space
const sendMessageText = document.getElementById("send-message-text")
sendMessageText.addEventListener("input", () => {
    let messageTrim = sendMessageText.value.trim()
    if (messageTrim === '') {
        document.getElementById("send-message-btn").disabled = true
    }
    else {
        document.getElementById("send-message-btn").disabled = false
    }
})

// check if image is null
const sendMessageImage = document.getElementById("send-message-image")
sendMessageImage.addEventListener("change", () => {
    document.getElementById("send-message-btn").disabled = false
})

// send a new message and show in the screen
const sendMessageBtn = document.getElementById("send-message-btn")
sendMessageBtn.addEventListener("click", () => {
    // if send a message
    if (document.getElementById("choose-message-type").value === "Text") {
        const sendMessage = sendMessageText.value
        let postMessage = {
            "message": sendMessage
        }
        fetch(`http://127.0.0.1:${BACKEND_PORT}/message/${localStorage.getItem("nowChannelId")}`, {
            method: 'POST',
            body: JSON.stringify(postMessage),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(getNewMessageId(sendMessage, true))
                }
                else {
                    res.json().then(data => {
                        errorMsg(data.error, "single-channel-part")
                    })
                }
            })
            .catch(e => errorMsg('error', "single-channel-part"))
    }
    //  if it is a image
    else {
        fileToDataUrl(document.getElementById("send-message-image").files[0])
            .then(data => {
                let postMessage = {
                    "image": data
                }
                fetch(`http://127.0.0.1:${BACKEND_PORT}/message/${localStorage.getItem("nowChannelId")}`, {
                    method: 'POST',
                    body: JSON.stringify(postMessage),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    }
                })
                    .then(res => {
                        if (res.status === 200) {
                            res.json()
                                .then(getNewMessageId(data, false))
                        }
                        else {
                            res.json().then(data => {
                                errorMsg(data.error, "single-channel-part")
                            })
                        }
                    })
                    .catch(e => errorMsg('error', "single-channel-part"))
            })
    }
})

// get the new send message's id and create a message to channel
function getNewMessageId(sendMessage, isMessage) {
    // get new send message id
    fetch(`http://127.0.0.1:${BACKEND_PORT}/message/${localStorage.getItem("nowChannelId")}?start=0`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    const userSelfId = Number(localStorage.getItem("userId"))
                    const sendTime = new Date().toISOString()
                    // create new message
                    if (isMessage) {
                        messageCreate(userSelfId, sendTime, sendMessage, true, data.messages[0].id, false, null, false, true)
                    }
                    else {
                        messageCreate(userSelfId, sendTime, data.messages[0].image, true, data.messages[0].id, false, null, false, false)
                    }
                    sendMessageText.value = ''
                    document.getElementById("send-message-image").value = ''
                    document.getElementById("send-message-btn").disabled = true
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
