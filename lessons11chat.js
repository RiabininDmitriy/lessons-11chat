let lastUpdate
let chat
let posts
let users
let currentUser

let getData = function (ref) {
    return fetch('http://localhost:3000/' + ref)
        .then(response => response.json())
}

let appElem = (tagName, container) =>
    (container && container instanceof HTMLElement ? container : document.body)
        .appendChild(
            document.createElement(tagName)
        )

let chatInput = appElem('input')
chatInput.style = `
    position: fixed;
    left: 20px;
    width: 80%;
    bottom: 10px;
    border: inset 1px;
    background-color: #af9;
    overflow: auto;
`

let buildChat = function () {
    chat = appElem('section')
    chat.style = `
        position: fixed;
        top: 30px;
        left: 20px;
        right: 20px;
        bottom: 70px;
        border: inset 1px;
        overflow: auto;
        padding: 10px;
    `
}

let initChat = async function () {
    chat.innerHTML = ""
    posts.forEach(post => {
        let user = users.filter(
            x => x.id === post.userId
        )[0]
        chat.appendChild(
            (function () {
                let cont = appElem('div')
                let ava = appElem('img', cont)
                ava.src = user.photoURL
                ava.width = "40"
                ava.title = ` ${user.name} ${user.lastName}`
                appElem('span', cont).innerHTML =
                    ` <small> ${post.date} ${post.time}</small>`
                appElem('p', cont).innerText = post.body
                return cont
            })(user)
        )
    })
}

let updateChat = async function () {
    let updated = await getData("lastUpdate")
    if (lastUpdate && updated.data === lastUpdate.data &&
        updated.time === lastUpdate.time) return

    let scrollValue = chat.scrollTop

    await Promise.all([
        getData("users").then(x => users = x),
        getData("posts").then(x => posts = x)
    ])

    if (!currentUser) {
        currentUser = users[
            Math.floor(Math.random() * users.length)
        ]
        currentUserId = currentUser.id
    }

    initChat()
    chat.scrollTop = scrollValue
}

buildChat()
updateChat()

setTimeout(function () {
    chat.scrollTop = chat.scrollHeight
}, 100)

let interval = setInterval(function () {
    updateChat()
}, 1000)

chatInput.onchange = function (event) {
    let postTime = new Date().toLocaleString().split(', ')
    fetch('http://localhost:3000/posts', {
        method: 'POST',
        body: JSON.stringify({
            date: postTime[0],
            time: postTime[1],
            userId: currentUserId,
            body: event.target.value
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
}


const btn = document.createElement('button')
btn.innerText = "OK"
btn.style = `
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    padding: 2px 5px 2px 10px;
`
document.body.appendChild(btn)

const userReg = document.createElement('input')
userReg.placeholder = "Укажите свой ник-нэйм"
userReg.style = `background-size: contain;
    background-repeat: no-repeat;
    background-position: left center;
    padding: 2px 5px 2px 10px;
`
document.body.appendChild(userReg)


btn.addEventListener('click', function (event) {
    let userName = userReg.value
    console.log(userName)
    fetch('http://localhost:3000/users', {
        method: 'POST',
        body: JSON.stringify({
            "id": users.length + 1,
            "name": userName
        }),
        headers: {
            "Content-type": "application/json"
        }
    })
        .then(response => {
            console.log('response: ', response)
        })
}, true)