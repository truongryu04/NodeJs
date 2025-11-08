// ChangeStatus
const ButtonChangeStatus = document.querySelectorAll("[button-change-status]")
console.log(ButtonChangeStatus)
if (ButtonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status")
    const path = formChangeStatus.getAttribute("path")
    ButtonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status")
            const id = button.getAttribute("data-id")
            console.log(statusCurrent)
            let statusChange = statusCurrent == "active" ? "inactive" : "active"
            console.log(statusChange)

            const action = path + `/${statusChange}/${id}?_method=PATCH`
            console.log(action)

            formChangeStatus.action = action
            formChangeStatus.submit()

        })
    })
}
// End changeStatus