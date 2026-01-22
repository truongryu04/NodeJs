// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]")
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener('click', (e) => {
            const userId = button.getAttribute("btn-add-friend")
            button.closest(".box-user").classList.add("add")
            console.log(userId)
            socket.emit("CLIENT_ADD_FRIEND", userId)
        })
    })
}
// Chức năng gửi yêu câù