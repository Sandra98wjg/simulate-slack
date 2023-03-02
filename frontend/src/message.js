
// this js is main on create single message and set message to channel
// create single message
function messageCreate(id, sendTime, message, isNew, messageId, edited, editedAt, pinned, isMessage) {
    // get user and send date info
    userName = userInfos.get(id).name
    userImg = userInfos.get(id).image ? userInfos.get(id).image : defaultImg
    let sendDate = new Date(sendTime).toLocaleString()
    // build message
    // the total div
    const singleMessage = document.createElement('div')
    singleMessage.setAttribute("class", "single-messages")
    singleMessage.id = `${messageId}`
    // the avatar div in the total div
    const singleMessageAvatar = document.createElement('div')
    singleMessageAvatar.setAttribute("class", "single-messages-avatar")
    const singleMessageAvatarImg = document.createElement('img')
    singleMessageAvatarImg.src = `${userImg}`
    singleMessageAvatarImg.setAttribute("class", "user-avatar")
    singleMessageAvatar.appendChild(singleMessageAvatarImg)
    singleMessage.appendChild(singleMessageAvatar)
    // the message div in the total div
    const singleMessageContent = document.createElement('div')
    singleMessageContent.id = `text${messageId}`
    // h6 username send date and menu
    const singleMessageContentTitle = document.createElement('h6')
    singleMessageContentTitle.setAttribute("class", "name-time")
    // name
    const singleMessageContentName = document.createElement('button')
    singleMessageContentName.setAttribute("class", "userNameBtn")
    singleMessageContentName.setAttribute("onclick", `toUserProfiles(${id})`)
    singleMessageContentName.textContent = `${userName}`
    singleMessageContentTitle.appendChild(singleMessageContentName)
    // send date
    const singleMessageContentDate = document.createElement('span')
    singleMessageContentDate.setAttribute("class", "name-time-span")
    singleMessageContentDate.textContent = `${sendDate}`
    singleMessageContentTitle.appendChild(singleMessageContentDate)
    // drop down menu code from https://getbootstrap.com/docs/5.2/components/dropdowns/
    const singleMessageMenuTotal = document.createElement('span')
    singleMessageMenuTotal.setAttribute("class", "message-react-btn")
    // dropdown
    const singleMessageDropDown = document.createElement('div')
    singleMessageDropDown.setAttribute("class", "btn-group dropdown")
    // dropdown btn
    const singleMessageDropDownBtn = document.createElement('button')
    singleMessageDropDownBtn.type = "button"
    singleMessageDropDownBtn.setAttribute("class", "dropdown-toggle dropdown-toggle-split more-btn dropdown-btn")
    singleMessageDropDownBtn.setAttribute("data-bs-toggle", "dropdown")
    singleMessageDropDownBtn.setAttribute("aria-expanded", "false")
    // span in dropdown btn
    const singleMessageDropDownSpan = document.createElement('span')
    singleMessageDropDownSpan.setAttribute("class", "visually-hidden")
    singleMessageDropDownSpan.textContent = "Toggle Dropdown"
    singleMessageDropDownBtn.appendChild(singleMessageDropDownSpan)
    singleMessageDropDown.appendChild(singleMessageDropDownBtn)
    // menu
    const singleMessageMenu = document.createElement('div')
    singleMessageMenu.setAttribute("class", "dropdown-menu")
    // emoji in menu
    const singleMessageEmoji = document.createElement('li')
    // div in emoji
    const singleMessageEmojiDiv = document.createElement('div')
    singleMessageEmojiDiv.setAttribute("class", "emoji-btn")
    // happy in div
    // <span><button class="emoji dropdown-item" onclick="showEmoji(${messageId},1)">&#128516;</button></span>
    const singleMessageHappy = document.createElement('button')
    singleMessageHappy.setAttribute("class", "emoji dropdown-item")
    singleMessageHappy.setAttribute("onclick", `showEmoji(${messageId},1)`)
    singleMessageHappy.textContent = String.fromCodePoint(128516)
    singleMessageEmojiDiv.appendChild(singleMessageHappy)
    // sad in div
    const singleMessageSad = document.createElement('button')
    singleMessageSad.setAttribute("class", "emoji dropdown-item")
    singleMessageSad.setAttribute("onclick", `showEmoji(${messageId},2)`)
    singleMessageSad.textContent = String.fromCodePoint(128542)
    singleMessageEmojiDiv.appendChild(singleMessageSad)
    // love in div
    const singleMessageLove = document.createElement('button')
    singleMessageLove.setAttribute("class", "emoji dropdown-item")
    singleMessageLove.setAttribute("onclick", `showEmoji(${messageId},3)`)
    singleMessageLove.textContent = String.fromCodePoint(128151)
    singleMessageEmojiDiv.appendChild(singleMessageLove)
    // div append to emoji
    singleMessageEmoji.appendChild(singleMessageEmojiDiv)
    // add li singleMessageEmoji to singleMessageMenu
    singleMessageMenu.appendChild(singleMessageEmoji)
    // pin in menu
    const singleMessagePin = document.createElement('li')
    const singleMessagePinBtn = document.createElement('button')
    singleMessagePinBtn.setAttribute("class", "dropdown-item")
    singleMessagePinBtn.setAttribute("onclick", `pinMessage(${messageId})`)
    singleMessagePinBtn.textContent = "Pin/Unpin"
    singleMessagePin.appendChild(singleMessagePinBtn)
    singleMessageMenu.appendChild(singleMessagePin)
    // if is current user's message
    if (id === Number(localStorage.getItem("userId"))) {
        // edit in menu
        const singleMessageEdit = document.createElement('li')
        const singleMessageEditBtn = document.createElement('button')
        singleMessageEditBtn.setAttribute("class", "dropdown-item")
        singleMessageEditBtn.setAttribute("onclick", `editMessage(${messageId},${isMessage})`)
        singleMessageEditBtn.textContent = "Edit"
        singleMessageEdit.appendChild(singleMessageEditBtn)
        singleMessageMenu.appendChild(singleMessageEdit)
        // delete in menu
        const singleMessageDelete = document.createElement('li')
        const singleMessageDeleteBtn = document.createElement('button')
        singleMessageDeleteBtn.setAttribute("class", "dropdown-item")
        singleMessageDeleteBtn.setAttribute("onclick", `deleteMessage(${messageId})`)
        singleMessageDeleteBtn.textContent = "Delete"
        singleMessageDelete.appendChild(singleMessageDeleteBtn)
        singleMessageMenu.appendChild(singleMessageDelete)
    }
    singleMessageDropDown.appendChild(singleMessageMenu)
    singleMessageMenuTotal.appendChild(singleMessageDropDown)
    singleMessageContentTitle.appendChild(singleMessageMenuTotal)
    // pinned symbol
    const singleMessageEditSymbol = document.createElement('span')
    singleMessageEditSymbol.setAttribute("class", "pinned-symbol")
    singleMessageEditSymbol.id = `pin${messageId}`
    singleMessageEditSymbol.textContent = "(Pinned)"
    singleMessageContentTitle.appendChild(singleMessageEditSymbol)
    // title part done
    singleMessageContent.appendChild(singleMessageContentTitle)
    // text part
    const singleMessageContentText = document.createElement('p')
    singleMessageContentText.setAttribute("class", "single-messages-text")
    singleMessageContentText.id = `message${messageId}`
    // message in text part
    // if is a message
    if (isMessage) {
        const singleMessageContentMessage = document.createElement('span')
        singleMessageContentMessage.id = `message-text${messageId}`
        singleMessageContentMessage.textContent = `${message}`
        singleMessageContentText.appendChild(singleMessageContentMessage)
    }
    // if is image
    else {
        // document.getElementById("thumbnails").textContent=''
        const singleMessageContentImg = document.createElement('img')
        singleMessageContentImg.id = `message-text${messageId}`
        singleMessageContentImg.setAttribute("class", "message-image")
        singleMessageContentImg.setAttribute("data-bs-toggle", "modal")
        singleMessageContentImg.setAttribute("data-bs-target", "#staticBackdrop")
        singleMessageContentImg.setAttribute("onclick", `clickThumbnails(${messageId})`)
        singleMessageContentImg.src = `${message}`
        singleMessageContentText.appendChild(singleMessageContentImg)
        if (document.getElementById(`thumbnails${messageId}`) === null) {
            // add to thumbnails
            const modalImg = document.createElement('img')
            modalImg.src = `${message}`
            modalImg.setAttribute("class", "modal-image")
            modalImg.id = `thumbnails${messageId}`
            modalImg.style.display = "none"
            document.getElementById("thumbnails").prepend(modalImg)
        }
    }
    // edited symbol in text part
    const singleMessageContentEdit = document.createElement('span')
    singleMessageContentEdit.setAttribute("class", "edited-symbol")
    singleMessageContentEdit.id = `edited${messageId}`
    if (edited) {
        const editedTime = new Date(editedAt).toLocaleString()
        singleMessageContentEdit.textContent = `(edited at ${editedTime})`
    }
    singleMessageContentText.appendChild(singleMessageContentEdit)
    singleMessageContent.appendChild(singleMessageContentText)
    // show emoji part
    const singleMessageShowEmoji = document.createElement('div')
    // happy emoji
    const singleMessageShowHappy = document.createElement('button')
    singleMessageShowHappy.setAttribute("class", "show-emoji")
    singleMessageShowHappy.id = `happy-emoji${messageId}`
    singleMessageShowHappy.setAttribute("onclick", `hideEmoji(${messageId},1)`)
    singleMessageShowHappy.textContent = String.fromCodePoint(128516)
    singleMessageShowEmoji.appendChild(singleMessageShowHappy)
    // sad emoji
    const singleMessageShowSad = document.createElement('button')
    singleMessageShowSad.setAttribute("class", "show-emoji")
    singleMessageShowSad.id = `sad-emoji${messageId}`
    singleMessageShowSad.setAttribute("onclick", `hideEmoji(${messageId},2)`)
    singleMessageShowSad.textContent = String.fromCodePoint(128542)
    singleMessageShowEmoji.appendChild(singleMessageShowSad)
    // love emoji
    const singleMessageShowLove = document.createElement('button')
    singleMessageShowLove.setAttribute("class", "show-emoji")
    singleMessageShowLove.id = `love-emoji${messageId}`
    singleMessageShowLove.setAttribute("onclick", `hideEmoji(${messageId},3)`)
    singleMessageShowLove.textContent = String.fromCodePoint(128151)
    singleMessageShowEmoji.appendChild(singleMessageShowLove)
    singleMessageContent.appendChild(singleMessageShowEmoji)
    // add to content
    singleMessage.appendChild(singleMessageContent)
    if (!isNew) {
        document.getElementById("channel-message-part").prepend(singleMessage)
    }
    else {
        document.getElementById("channel-message-part").appendChild(singleMessage)
    }
    document.getElementById("channel-message-part").scrollTop = document.getElementById("channel-message-part").scrollHeight
    if (pinned) {
        document.getElementById(messageId).style.backgroundColor = "#f3e8bc"
        document.getElementById(`pin${messageId}`).style.display = "block"
    }
}

// get message for the channel
function getMessages(startId) {
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
                        if (message.image === undefined) {
                            messageCreate(message.sender, message.sentAt, message.message, false, message.id, message.edited, message.editedAt, message.pinned, true)
                        }
                        else {
                            messageCreate(message.sender, message.sentAt, message.image, false, message.id, message.edited, message.editedAt, message.pinned, false)
                        }
                        showHavedEmoji(message.id, message.reacts)
                        document.getElementById("channel-message-part").scrollTop = document.getElementById("channel-message-part").scrollHeight
                    }
                    if (data.messages.length === 25) {
                        getMessages(startId + 25)
                    }
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
// show specific img
function clickThumbnails(messageId) {
    const thumbnailId = "thumbnails" + messageId
    const totalThumbnails = document.getElementsByClassName("modal-image")
    for (const thumbnail of totalThumbnails) {
        if (thumbnail.id === thumbnailId) {
            thumbnail.style.display = "block"
        }
    }
}
// let this thumbnail to display none
const thumbnailsClose = document.getElementById("thumbnails-close")
thumbnailsClose.addEventListener("click", () => {
    const totalThumbnails = document.getElementsByClassName("modal-image")
    for (const thumbnail of totalThumbnails) {
        thumbnail.style.display = "none"
    }
})
