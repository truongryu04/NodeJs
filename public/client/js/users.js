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
// Chức năng gửi yêu câù

// Chức năng huỷ gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-add-friend]")
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener('click', (e) => {
            button.closest(".box-user").classList.remove("add")
            const userId = button.getAttribute("btn-cancel-friend")

            socket.emit("CLIENT_CANCEL_FRIEND", userId)
        })
    })
}
// Chức năng huỷ gửi yêu câù