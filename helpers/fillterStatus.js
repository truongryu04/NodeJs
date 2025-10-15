module.exports = (query) => {
    const fillterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ]

    if (query.status) {
        const index = fillterStatus.findIndex(item => item.status == query.status)
        fillterStatus[index].class = "active"
    }
    else {
        const index = fillterStatus.findIndex(item => item.status == "")
        fillterStatus[index].class = "active"
    }
    return fillterStatus
}