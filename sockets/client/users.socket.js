const Chat = require('../../models/chatModel')
const RoomChat = require('../../models/roomChatModel')
const User = require('../../models/userModel')
const uploadToCloudinary = require("../../helpers/uploadToCloudinary")
module.exports = (res) => {
    _io.once('connection', (socket) => {
        // Chức năng gửi yêu cầu
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id //id của người gửi kết bạn(A)
            // Thêm id của A vào acceptFriends của B
            const existAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if (!existAinB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: { acceptFriends: myUserId }
                })
            }
            // Thêm id của B vào requestFriends của A
            const existBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if (!existBinA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: { requestFriends: userId }
                })
            }
            // Lấy độ dài acceptFiend của B trả cho B
            const infoUser = await User.findOne({
                _id: userId
            })
            const lengthAcceptFriends = infoUser.acceptFriends.length
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })

            // Lấy infor của A vầ trả về cho B
            const infoUserA = await User.findOne({
                _id: myUserId
            }).select("id avatar fullName")
            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId,
                infoUserA: infoUserA
            })
        })


        // Chức năng huỷ gửi yêu cầu
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id  //id của (A)

            // Xoá id của A vào acceptFriends của B
            const existAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })
            if (existAinB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $pull: { acceptFriends: myUserId }
                })
            }
            // Xoá id của B vào requestFriends của A
            const existBinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })
            if (existBinA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $pull: { requestFriends: userId }
                })
            }
            // Lấy độ dài acceptFiend của B trả cho B
            const infoUser = await User.findOne({
                _id: userId
            })
            const lengthAcceptFriends = infoUser.acceptFriends.length
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            })
            // Lấy Id của A và trả về cho B
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userId: userId,
                userIdA: myUserId
            })
        })

        // Chức năng từ chối kết bạn
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id  //id của (B)

            // Xoá id của A vào acceptFriends của B
            const existAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            if (existAinB) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $pull: { acceptFriends: userId }
                })
            }
            // Xoá id của B vào requestFriends của A
            const existBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            if (existBinA) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $pull: { requestFriends: myUserId }
                })
            }
        })

        // Chức năng chấp nhận kết bạn
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {

            const myUserId = res.locals.user.id  //id của (B)
            // Check exist
            const existAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })
            const existBinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })
            // Tạo phòng chat chung
            let roomChat;
            if (existAinB && existBinA) {
                const dataRoom = {
                    typeRoom: "friend",
                    users: [{
                        user_id: userId,
                        role: "superAdmin",
                    },
                    {
                        user_id: myUserId,
                        role: "superAdmin",
                    }],
                }
                roomChat = new RoomChat(dataRoom)
                await roomChat.save()
            }


            // Thêm {user_id,room_chat_id} của A vào friendList B
            // Xoá id của A vào acceptFriends của B
            if (existAinB) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: {
                        friendList: {
                            user_id: userId,
                            room_chat_id: roomChat.id
                        }
                    },
                    $pull: { acceptFriends: userId }
                })
            }

            // Thêm {user_id,room_chat_id} của b vào friendList A
            // Xoá id của B vào requestFriends của A
            if (existBinA) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: roomChat.id,
                        }
                    },
                    $pull: { requestFriends: myUserId }
                })
            }
        })
    })
}