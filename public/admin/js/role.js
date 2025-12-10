// Permissions
const tablePermissions = document.querySelector("[table-permissions]")
if (tablePermissions) {
    const buttonSubmit = document.querySelector("[button-submit]")
    buttonSubmit.addEventListener("click", () => {
        const permissions = []
        const rows = tablePermissions.querySelectorAll("[data-name]")

        rows.forEach(row => {
            const name = row.getAttribute("data-name")
            const inputs = row.querySelectorAll("input")
            if (name == "id") {
                inputs.forEach(input => {
                    permissions.push({
                        id: input.value,
                        permissions: []
                    })
                })
            }
            else {
                inputs.forEach((input, index) => {
                    const checked = input.checked
                    if (checked) {
                        permissions[index].permissions.push(name)
                    }
                })
            }
        })
        if (permissions.length > 0) {
            const formChangePermissions = document.querySelector("#form-change-permissions")
            const inputPerrmission = formChangePermissions.querySelector("input[name='permissions']")
            inputPerrmission.value = JSON.stringify(permissions)
            formChangePermissions.submit()
        }

    })
}
// End Permissions

// Permissions Checked
const dataRoles = document.querySelector("[data-roles]")
if (dataRoles) {
    const data = JSON.parse(dataRoles.getAttribute("data-roles"))
    const tablePermissions = document.querySelector("[table-permissions]")

    data.forEach((item, index) => {
        const permissions = item.permissions
        permissions.forEach(permission => {
            const row = tablePermissions.querySelector(`[data-name="${permission}"]`)
            const input = row.querySelectorAll("input")[index]
            input.checked = true
        })
    })


}
// End Permissions Checked