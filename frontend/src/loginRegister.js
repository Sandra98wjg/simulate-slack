// this js is main to login and register
// popup the error message
function errorMsg(err, page) {
    //this part of code was copy from BootStrap--https://getbootstrap.com/docs/5.2/components/alerts/
    const wrapper = document.createElement('div')
    const wrapperTotal = document.createElement('div')
    wrapperTotal.setAttribute("class", "alert alert-sucess alert-dismissible")
    wrapperTotal.setAttribute("role", "alert")
    wrapperTotal.setAttribute("id", "alert-error")
    const wrapperShow = document.createElement("div")
    wrapperShow.textContent = `${err}`
    const wrapperClose = document.createElement('button')
    wrapperClose.setAttribute("type", "button")
    wrapperClose.setAttribute("class", "btn-close")
    wrapperClose.setAttribute("data-bs-dismiss", "alert")
    wrapperClose.setAttribute("aria-label", "Close")
    wrapperTotal.appendChild(wrapperShow)
    wrapperTotal.appendChild(wrapperClose)
    wrapper.appendChild(wrapperTotal)
    document.getElementById(page).appendChild(wrapper)
}

BACKEND_PORT=5005

// click register button then hide login part and show register part
const loginRegister = document.getElementById("login-register")
loginRegister.addEventListener("click", () => {
    document.getElementById("login-page").style.display = "none"
    document.getElementById("register-page").style.display = "block"
})

//click submit button to sent to POST /auth/login to verify the credentials
//If there is an error during login an appropriate error should appear on the screen.
const loginSubmit = document.getElementById("login-submit")
loginSubmit.addEventListener("click", () => {
    // get email and password
    let postMessage = {
        "email": document.getElementById("login-email").value,
        "password": document.getElementById("login-password").value
    }
    fetch(`http://127.0.0.1:${BACKEND_PORT}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(postMessage),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => {
            if (res.status === 200) {
                res.json().then(data => {
                    localStorage.clear()
                    document.getElementById("login-page").style.display = "none"
                    localStorage.setItem("token", data.token)
                    localStorage.setItem("userId", data.userId)
                    document.getElementById("login-email").value = ''
                    document.getElementById("login-password").value=''
                }).then(toChannelPage)
            }
            else {
                res.json().then(data => {
                    errorMsg(data.error, "login-page")
                })
            }
        })
        .catch(e => errorMsg('error', "login-page"))
})

// click the submit button at register part
const registerSubmit = document.getElementById("register-submit")
registerSubmit.addEventListener("click", () => {
    // get all information
    let password = document.getElementById("register-password1").value
    let passwordConfirm = document.getElementById("register-password2").value
    // check 2 password is same
    if (password !== passwordConfirm) {
        errorMsg("Two passwords don't match", 'register-page')
    }
    else if (password === "") {
        errorMsg("Password is null", 'register-page')
    }
    else {
        let postMessage = {
            "email": document.getElementById("register-email").value,
            "password": password,
            "name": document.getElementById("register-name").value
        }
        fetch(`http://127.0.0.1:${BACKEND_PORT}/auth/register`, {
            method: 'POST',
            body: JSON.stringify(postMessage),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(data => {
                        document.getElementById("register-page").style.display = "none"
                        localStorage.setItem("token", data.token)
                        localStorage.setItem("userId", data.userId)
                        document.getElementById("register-email").value = ''
                        document.getElementById("register-password1").value = ''
                        document.getElementById("register-password2").value = ''
                        document.getElementById("register-name").value=''
                    }).then(toChannelPage)
                }
                else {
                    res.json().then(data => {
                        errorMsg(data.error, "register-page")
                    })
                }
            })
            .catch(e => errorMsg('error', "register-page"))
    }
})
