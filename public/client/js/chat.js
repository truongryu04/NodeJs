import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
// - Upload file with preview
import { FileUploadWithPreview } from 'https://unpkg.com/file-upload-with-preview@6/dist/index.js';
const upload = new FileUploadWithPreview('upload-images', {
    multiple: true, maxFileCount: 6
})
//- End Upload file with preview

// Client_send_message
const formSendData = document.querySelector(".chat .inner-form")
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault()
        const content = e.target.elements.content.value
        const images = upload.cachedFileArray;
        // const images = []
        if (content || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            })
            e.target.elements.content.value = ""
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING", "hidden")
        }

    })
}
// End Client_send_message

// Server_return_message
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id")
    const body = document.querySelector(".chat .inner-body")
    const boxTyping = document.querySelector(".chat .inner-list-typing")

    const div = document.createElement("div")
    let htmlFullName = ""
    let htmlContent = ""
    let htmlImages = ""
    if (myId == data.user_id) {
        div.classList.add("inner-outgoing")
    }
    else {
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`
        div.classList.add("inner-incoming")
    }
    if (data.content) {
        htmlContent = `<div class = "inner-content">${data.content}</div>`
    }
    if (data.images.length > 0) {
        htmlImages += `<div class = "inner-images">`
        for (const image of data.images) {
            htmlImages += `<img src ="${image}">`
        }
        htmlImages += `</div>`
    }
    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `
    body.insertBefore(div, boxTyping)
    body.scrollTop = bodyChat.scrollHeight
    const gallery = new Viewer(div);
})

// Scroll Chat to Bottom
const bodyChat = document.querySelector(".chat .inner-body")
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight
}
// End Scroll Chat to Bottom

// Show Icon Chat
// Show PopUp
const buttonIcon = document.querySelector('.button-icon')
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip')
    Popper.createPopper(buttonIcon, tooltip)
    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}
// End Show PopUp


// Show typing
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show")
    clearTimeout(timeOut)
    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden")
    }, 3000)
}
// End Show typing
// Insert Icon to Input
const emojiPicker = document.querySelector("emoji-picker")
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']")
    emojiPicker.addEventListener('emoji-click', e => {
        const icon = e.detail.unicode
        inputChat.value = inputChat.value + icon
        inputChat.setSelectionRange(inputChat.value.length, inputChat.value.length)
        inputChat.focus()
        showTyping()
    })
    inputChat.addEventListener("keyup", () => {
        showTyping()
    })

}
// End Insert Icon to Input
// End Show Icon Chat

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing")
if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {

        if (data.type == "show") {
            const body = document.querySelector(".chat .inner-body")
            const existTyping = document.querySelector(`[user-id="${data.user_id}"]`)
            if (!existTyping) {
                const boxTyping = document.createElement("div")
                boxTyping.classList.add("box-typing")
                boxTyping.setAttribute("user-id", data.user_id)
                boxTyping.innerHTML = `
                <div class="inner-name">${data.fullName}</div>
                <div class="inner-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `
                elementListTyping.appendChild(boxTyping)
                body.scrollTop = bodyChat.scrollHeight
            }
        } else {
            const boxTypingRemove = document.querySelector(`[user-id="${data.user_id}"]`)
            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove)
            }
        }

    })
}
// End SERVER_RETURN_TYPING

// Preview full image
const bodyChatPreviewImage = document.querySelector(".chat .inner-body")
if (bodyChatPreviewImage) {
    const gallery = new Viewer(bodyChatPreviewImage);
}
// End Preview full image


