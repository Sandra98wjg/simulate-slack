// this js is main to operate emojis
// send react emojis, show success react emoji
function showEmoji(messageId, status) {
    let postMessage = ''
    if (status === 1) {
        postMessage = {
            "react": "&#128516;"
        }
    }
    else if (status === 2) {
        postMessage = {
            "react": "&#128577;"
        }
    }
    else {
        postMessage = {
            "react": "&#128151;"
        }
    }
    fetch(`http://127.0.0.1:${BACKEND_PORT}/message/react/${localStorage.getItem("nowChannelId")}/${messageId}`, {
        method: 'POST',
        body: JSON.stringify(postMessage),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    if (status === 1) {
                        document.getElementById(`happy-emoji${messageId}`).style.display = "inline-block"
                    }
                    else if (status === 2) {
                        document.getElementById(`sad-emoji${messageId}`).style.display = "inline-block"
                    }
                    else {
                        document.getElementById(`love-emoji${messageId}`).style.display = "inline-block"
                    }

                })
            }
        })
        .catch(e => errorMsg('error',  "single-channel-part"))
}
// unreact emoji, cancel display it
function hideEmoji(messageId, status) {
    let postMessage = ''
    if (status === 1) {
        postMessage = {
            "react": "&#128516;"
        }
    }
    else if (status === 2) {
        postMessage = {
            "react": "&#128577;"
        }
    }
    else {
        postMessage = {
            "react": "&#128151;"
        }
    }
    fetch(`http://127.0.0.1:${BACKEND_PORT}/message/unreact/${localStorage.getItem("nowChannelId")}/${messageId}`, {
        method: 'POST',
        body: JSON.stringify(postMessage),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    if (status === 1) {
                        document.getElementById(`happy-emoji${messageId}`).style.display = "none"
                    }
                    else if (status === 2) {
                        document.getElementById(`sad-emoji${messageId}`).style.display = "none"
                    }
                    else {
                        document.getElementById(`love-emoji${messageId}`).style.display = "none"
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
// show already haved emojis
function showHavedEmoji(messageId, emojis) {
    for (let emoji of emojis) {
        if (emoji.react === "&#128516;") {
            document.getElementById(`happy-emoji${messageId}`).style.display = "inline-block"
        }
        if (emoji.react === "&#128577;") {
            document.getElementById(`sad-emoji${messageId}`).style.display = "inline-block"
        }
        if (emoji.react === "&#128151;") {
            document.getElementById(`love-emoji${messageId}`).style.display = "inline-block"
        }
    }
}