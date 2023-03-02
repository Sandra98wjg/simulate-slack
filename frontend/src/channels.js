// this js is main for channels
function fileToDataUrl(file) {
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }

    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}
// this is the default image
const defaultImg = 'https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?k=20&m=1300845620&s=612x612&w=0&h=f4XTZDAv7NPuZbG0habSpU0sNgECM0X7nbKzTUta3n8='
// show and hide pages
totalPages = ["channel-welcome-part", "create-channel-part", "join-channel-part", "single-channel-part", "channel-information-part", "edit-channel-part", "invite-channel-part", "user-profile-part", "modify-proflie-part"]
function showPage(pageName) {
    for (let page of totalPages) {
        if (page === pageName) {
            document.getElementById(page).style.display = "block"
        }
        else {
            document.getElementById(page).style.display = "none"
        }
    }
}
// set page information for this page
function setChannelInfo(name, description, private, createTime, creatorId) {
    document.getElementById("channelName").textContent = `Channel Name: ${name}`
    document.getElementById("channelDescription").textContent = `Description: ${description}`
    document.getElementById("channelPrivate").textContent = `Channel Private: ${private}`
    let createDate = new Date(createTime).toLocaleString()
    document.getElementById("channelCreatTime").textContent = `Channel Create Time: ${createDate}`
    document.getElementById("channelCreatorName").textContent = `Creator Name: ${userInfos.get(creatorId).name}`
}
// set edit channel information
function setEditChannelInfo(name, description) {
    document.getElementById("edit-channel-name").value = name
    document.getElementById("edit-channel-description").value = description
}

// check if user is a member of this channel
function isMember(members) {
    return members.includes(Number(localStorage.getItem("userId")))
}
// create the single channel button
function createChannelBtn(name, id) {
    let channelList = document.createElement('button')
    channelList.className = "nav-link"
    channelList.id = id
    channelList.textContent = `${name}`
    return channelList
}
// get channel Information
function channelTotalInfo(channelId) {
    fetch(`http://127.0.0.1:${BACKEND_PORT}/channel/${channelId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    localStorage.setItem("nowChannelId", channelId)
                    setChannelInfo(data.name, data.description, data.private, data.createdAt, data.creator)
                    setEditChannelInfo(data.name, data.description)
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
// show the channel welcome page
function toChannelPage() {
    document.getElementById("channels-page").style.display = "block"
    document.getElementById("channel-welcome-part").style.display = "block"
    fetch(`http://127.0.0.1:${BACKEND_PORT}/channel`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    data.channels.map(channel => {
                        // display channels to public and private
                        if (channel.private && isMember(channel.members)) {
                            if (document.getElementById(channel.id) === null) {
                                document.getElementById('private-channel-nav').append(createChannelBtn(channel.name, channel.id))
                                singleChannelPage(channel.id)
                            } 
                        }
                        else if (!channel.private) {
                            if (document.getElementById(channel.id) === null) { 
                                document.getElementById('public-channel-nav').append(createChannelBtn(channel.name, channel.id))
                                singleChannelPage(channel.id)
                            }                          
                        }
                    })
                }).then(getAllUserInfo)
            }
            else {
                res.json().then(data => {
                    errorMsg(data.error, "channel-welcome-part")
                })
            }
        })
        .catch(e => errorMsg('error', "channel-welcome-part"))
}
// click the add channel button to show the create-channel-part
const addChanelBtn = document.getElementById("add-channel-btn")
addChanelBtn.addEventListener("click", () => {
    document.getElementById("new-channel-name").value = ''
    document.getElementById("new-channel-description").value = ''
    document.getElementById("new-channel-private").checked = false
    showPage("create-channel-part")
})

// input new channel information to add a new channel
const newChannelSubmitBtn = document.getElementById("new-channel-submit-btn")
newChannelSubmitBtn.addEventListener("click", () => {
    if (document.getElementById("new-channel-name").value !== "") {
        let name = document.getElementById("new-channel-name").value
        let private = document.getElementById("new-channel-private").checked
        let postMessage = {
            "name": name,
            "private": private,
            "description": document.getElementById("new-channel-description").value
        }
        fetch(`http://127.0.0.1:${BACKEND_PORT}/channel`, {
            method: 'POST',
            body: JSON.stringify(postMessage),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        //add private/public channel to different part
                        if (private) {
                            document.getElementById('private-channel-nav').append(createChannelBtn(name, data.channelId))
                        }
                        else {
                            document.getElementById('public-channel-nav').append(createChannelBtn(name, data.channelId))
                        }
                        singleChannelPage(data.channelId)
                        showPage("channel-welcome-part")
                    })
                }
                else {
                    res.json().then(data => {
                        errorMsg(data.error, "create-channel-part")
                    })
                }
            })
            .catch(e => errorMsg('error', "create-channel-part"))
    }
    else {
        errorMsg("Name should not be null", "create-channel-part")
    }
})

// click single channel link to get the single channel page
function singleChannelPage(channelId) {
    const singleChannelLink = document.getElementById(channelId)
    singleChannelLink.addEventListener("click", () => {
        localStorage.setItem("nowChannelId", channelId)
        fetch(`http://127.0.0.1:${BACKEND_PORT}/channel/${singleChannelLink.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                // if user is the member
                if (res.status === 200) {
                    res.json().then(data => {
                        document.getElementById("channel-message-part").textContent = ""
                        document.getElementById("pinned-messages-total").textContent = ""
                        showPage("single-channel-part")
                        setChannelInfo(data.name, data.description, data.private, data.createdAt, data.creator)
                        setEditChannelInfo(data.name, data.description)
                        document.getElementById("single-channel-name").textContent = `${data.name}`
                        getMessages(0)
                        document.getElementById("channel-message-part").scrollTop = document.getElementById("channel-message-part").scrollHeight
                    })
                }
                // if user in not a member of this channel
                else if (res.status === 403) {
                    res.json().then(data => {
                        localStorage.setItem("joinChannelId", singleChannelLink.id)
                    }).then(showPage("join-channel-part"))
                }
                else {
                    res.json().then(data => {
                        document.getElementById("channel-welcome-part").style.display = "block"
                        errorMsg(data.error, "channel-welcome-part")
                    })
                }
            })
            .catch(e => errorMsg('error', "channels-page"))
    })
}

// user can click the button to join the channel
const joinChannelBtn = document.getElementById("join-channel-btn")
joinChannelBtn.addEventListener("click", () => {
    fetch(`http://127.0.0.1:${BACKEND_PORT}/channel/${localStorage.getItem("joinChannelId")}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    channelTotalInfo(localStorage.getItem("joinChannelId"))
                    showPage("channel-welcome-part")
                })
                    .then(singleChannelPage(localStorage.getItem("joinChannelId")))
            }
            else {
                res.json().then(data => {
                    errorMsg(data.error, "join-channel-part")
                })
            }
        })
        .catch(e => errorMsg('error', "join-channel-part"))
})
// click the channel information button to show information
const channelInforBtn = document.getElementById("channel-information-btn")
channelInforBtn.addEventListener("click", () => {
    showPage("channel-information-part")

})
// from channel info back to channel part
function backToChannel() {
    showPage("single-channel-part")
}

// edit the channel information
const editChannelInformationBtn = document.getElementById("edit-channel-information-btn")
editChannelInformationBtn.addEventListener("click", () => {
    showPage("edit-channel-part")
})
// submit the channel edited information
const editChannelSubmitBtn = document.getElementById("edit-channel-submit-btn")
editChannelSubmitBtn.addEventListener("click", () => {
    let channelNewName = document.getElementById("edit-channel-name").value
    let postMessage = {
        "name": channelNewName,
        "description": document.getElementById("edit-channel-description").value
    }
    fetch(`http://127.0.0.1:${BACKEND_PORT}/channel/${localStorage.getItem("nowChannelId")}`, {
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
                    singleChannelPage(localStorage.getItem("nowChannelId"))
                    document.getElementById(localStorage.getItem("nowChannelId")).textContent = channelNewName
                    showPage("channel-welcome-part")
                })
            }
            else {
                res.json().then(data => {
                    errorMsg(data.error, "edit-channel-part")
                })
            }
        })
        .catch(e => errorMsg('error', "edit-channel-part"))
})


// leave the channel
const leaveChannelBtn = document.getElementById("leave-channel-btn")
leaveChannelBtn.addEventListener("click", () => {
    fetch(`http://127.0.0.1:${BACKEND_PORT}/channel/${localStorage.getItem("nowChannelId")}/leave`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    showPage("channel-welcome-part")
                    let leave = document.getElementById("channelPrivate").textContent
                    //if is a private channel
                    if (leave === 'Channel Private: true') {
                        document.getElementById(localStorage.getItem("nowChannelId")).style.display = "none"
                    }
                })
            }
            else {
                res.json().then(data => {
                    errorMsg(data.error, "channel-information-part")
                })
            }
        })
        .catch(e => errorMsg('error', "channel-information-part"))
})


function getAllUserInfo() {
    fetch(`http://127.0.0.1:${BACKEND_PORT}/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    data.users.map(user => {
                        setUserInfo(user.id)
                    })
                })
            }
            else {
                res.json().then(data => {
                    errorMsg(data.error, "channel-welcome-part")
                })
            }
        })
        .catch(e => errorMsg('error', "channel-welcome-part"))
}
let userInfos = new Map()
function setUserInfo(userId) {
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
                    userInfos.set(userId, data)
                })
            }
            else {
                res.json().then(data => {
                    errorMsg(data.error, "channel-welcome-part")
                })
            }
        })
        .catch(e => errorMsg('error', "channel-welcome-part"))
}



