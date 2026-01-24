// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]")
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener('click', (e) => {
            const userId = button.getAttribute("btn-add-friend")
            button.closest(".box-user").classList.add("add")

            socket.emit("CLIENT_ADD_FRIEND", userId)
        })
    })
}


// Chức năng huỷ gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]")
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener('click', (e) => {
            button.closest(".box-user").classList.remove("add")
            const userId = button.getAttribute("btn-cancel-friend")

            socket.emit("CLIENT_CANCEL_FRIEND", userId)
        })
    })
}


// Chức năng từ chối kết bạn
const refuseFriend = (button) => {
    button.addEventListener('click', (e) => {
        button.closest(".box-user").classList.add("refuse")
        const userId = button.getAttribute("btn-refuse-friend")

        socket.emit("CLIENT_REFUSE_FRIEND", userId)
    })
}
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        refuseFriend(button)
    })
}



// Chức năng chấp nhận kết bạn
const acceptFriend = (button) => {
    button.addEventListener('click', (e) => {
        button.closest(".box-user").classList.add("accepted")
        const userId = button.getAttribute("btn-accept-friend")

        socket.emit("CLIENT_ACCEPT_FRIEND", userId)
    })
}
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]")
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        acceptFriend(button)
    })
}


// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUserAccept = document.querySelector("[badge-users-accept]")
if (badgeUserAccept) {
    console.log("OK")
    const userId = badgeUserAccept.getAttribute("badge-users-accept")
    console.log(userId)
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
        if (data.userId === userId) {
            badgeUserAccept.innerHTML = data.lengthAcceptFriends
        }
    })
}

// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
const dataUsersAccept = document.querySelector("[data-users-accept]")
if (dataUsersAccept) {
    const userId = dataUsersAccept.getAttribute("data-users-accept")
    socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
        if (data.userId === userId) {
            // Vẽ user ra giao diện
            const div = document.createElement("div")
            div.classList.add("col-4")
            div.setAttribute("user-id", data.infoUserA._id)
            div.innerHTML = `
                <div class="box-user">
                    <div class="inner-avatar">
                        <img src=${data.infoUserA.avatar}>
                    </div>
                    <div class="inner-info">
                        <div class="inner-name">${data.infoUserA.fullName}
                        </div>
                        <div class="inner-buttons">
                            <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.infoUserA._id}>Chấp nhận</button>
                            <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend=${data.infoUserA._id}>Xoá</button>
                            <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend disabled>Đã xoá</button>
                            <button class="btn btn-sm btn-primary mr-1" btn-accepted-friend disabled>Đã chấp nhận</button>
                        </div>
                    </div>
                </div>
            `
            dataUsersAccept.appendChild(div)
            // Huỷ lời mời kết bạn
            const buttonRefuse = div.querySelector("[btn-refuse-friend]")
            refuseFriend(buttonRefuse)
            // Chấp nhận kết bạn
            const buttonAccept = div.querySelector("[btn-accept-friend]")
            acceptFriend(buttonAccept)
        }
    })
}

// End SERVER_RETURN_INFO_ACCEPT_FRIEND


// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const userIdA = data.userIdA
    const boxUserRemove = document.querySelector(`[user-id='${userIdA}']`)
    if (boxUserRemove) {
        const dataUsersAccept = document.querySelector("[data-users-accept]")
        const userId = dataUsersAccept.getAttribute("data-users-accept")
        if (userId === data.userId) {
            dataUsersAccept.removeChild(boxUserRemove)
        }

    }
})
// End SERVER_RETURN_USER_ID_CANCEL_FRIEND