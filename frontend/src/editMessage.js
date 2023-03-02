//this js is main to edit messages/images that have post on channel
// edit message/image
function editMessage(messageId, isMessage) {
    const editMessagePart = document.createElement('div')
    // if is message
    if (isMessage) {
        const uneditedMessage = document.getElementById(`message-text${messageId}`).textContent
        document.getElementById(`message${messageId}`).style.display = "none"
        const editMessageText = document.createElement('textarea')
        editMessageText.id = `edit-message-text${messageId}`
        editMessageText.textContent = `${uneditedMessage}`
        editMessagePart.appendChild(editMessageText)
    }
    // if is image
    else {
        document.getElementById(`message${messageId}`).style.display = "none"
        const editMessageImg = document.createElement('input')
        editMessageImg.id = `edit-message-text${messageId}`
        editMessageImg.type = "file"
        editMessagePart.appendChild(editMessageImg)
    }
    const editMessageBr = document.createElement('br')
    editMessagePart.appendChild(editMessageBr)
    // confirm button
    const editMessageConfirm = document.createElement('button')
    editMessageConfirm.type = "button"
    editMessageConfirm.setAttribute("class", "btn btn-outline-success btn-sm el-button edit-part-btn")
    editMessageConfirm.setAttribute("onclick", `confirmEditMessage(${messageId},${isMessage})`)
    editMessageConfirm.textContent = "Save"
    // cancel button
    const editMessageCancel = document.createElement('button')
    editMessageCancel.type = "button"
    editMessageCancel.setAttribute("class", "btn btn-outline-primary btn-sm el-button edit-part-btn")
    editMessageCancel.setAttribute("onclick", `cancelEditMessage(${messageId})`)
    editMessageCancel.textContent = "Cancel"
    editMessagePart.appendChild(editMessageConfirm)
    editMessagePart.appendChild(editMessageCancel)
    editMessagePart.id = `edit${messageId}`
    document.getElementById(`text${messageId}`).appendChild(editMessagePart)
}

// cancel edit message/image
function cancelEditMessage(messageId) {
    document.getElementById(`edit${messageId}`).remove()
    document.getElementById(`message${messageId}`).style.display = "block"
}

// success edit message/image
function confirmEditMessage(messageId, isMessage) {
    // if it is message
    if (isMessage) {
        const editedMessage = document.getElementById(`edit-message-text${messageId}`).value
        const oldMessage = document.getElementById(`message-text${messageId}`)
        // if didn't change message
        if (editedMessage == oldMessage.textContent) {
            document.getElementById(`edit${messageId}`).remove()
            document.getElementById(`message${messageId}`).style.display = "block"
        }
        else {
            let postMessage = {
                "message": editedMessage
            }
            fetch(`http://127.0.0.1:${BACKEND_PORT}/message/${localStorage.getItem("nowChannelId")}/${messageId}`, {
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
                            // remove old edited symbol
                            oldMessage.textContent = editedMessage
                            showEditSymbol(messageId)

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
    }
     // if it is image
    else {
        const oldMessage = document.getElementById(`message-text${messageId}`)
        fileToDataUrl(document.getElementById(`edit-message-text${messageId}`).files[0])
            .then(data => {
                let postMessage = {
                    "image": data
                }
                fetch(`http://127.0.0.1:${BACKEND_PORT}/message/${localStorage.getItem("nowChannelId")}/${messageId}`, {
                    method: 'PUT',
                    body: JSON.stringify(postMessage),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    }
                })
                    .then(res => {
                        if (res.status === 200) {
                            res.json().then(json => {
                                oldMessage.src = data
                                showEditSymbol(messageId)
                            })
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

}
// show the edited symbol
function showEditSymbol(messageId) {
    // rempve previous symbol
    document.getElementById(`edited${messageId}`).remove()
    document.getElementById(`edit${messageId}`).remove()
    // add new symbol
    const nowTime = new Date(new Date().toISOString()).toLocaleString()
    document.getElementById(`message${messageId}`).style.display = "block"
    const editedSymbol = document.createElement('span')
    editedSymbol.textContent = `(edited at ${nowTime})`
    editedSymbol.className = "edited-symbol"
    editedSymbol.id = `edited${messageId}`
    document.getElementById(`message${messageId}`).append(editedSymbol)
}