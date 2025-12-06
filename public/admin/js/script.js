// Button status
const buttonsstatus = document.querySelectorAll("[button-status]")

if (buttonsstatus.length > 0) {
    let url = new URL(window.location.href)
    buttonsstatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status")
            if (status) {
                url.searchParams.set("status", status)
            }
            else {
                url.searchParams.delete("status")
            }
            window.location.href = url.href
        })
    })
}
// End button status

// Search
const formSearch = document.querySelector("#form-search")
if (formSearch) {
    let url = new URL(window.location.href)
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault()
        const keyword = e.target.elements.keyword.value
        if (keyword) {
            url.searchParams.set("keyword", keyword)
        }
        else {
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href
    })
}

// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]")
if (buttonPagination) {
    let url = new URL(window.location.href)
    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination")

            url.searchParams.set("page", page)
            window.location.href = url.href
        })




    })
}
// End Pagination

// CheckboxMulti
const CheckboxMulti = document.querySelector("[checkbox-multi]")
if (CheckboxMulti) {
    const inputCheckAll = CheckboxMulti.querySelector("input[name='checkall']")
    const inputsId = CheckboxMulti.querySelectorAll("input[name='id']")
    inputCheckAll.addEventListener('click', () => {
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true
            })
        }
        else {
            inputsId.forEach(input => {
                input.checked = false
            })
        }

    })
    inputsId.forEach(input => {
        input.addEventListener('click', () => {
            const countChecked = CheckboxMulti.querySelectorAll("input[name='id']:checked").length
            const lengthList = inputsId.length
            if (countChecked == lengthList) {
                inputCheckAll.checked = true
            }
            else {
                inputCheckAll.checked = false
            }
        })
    })
}
// End CheckboxMulti

// ChangeMulti
const formChangeMulti = document.querySelector("[form-change-multi]")
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault()
        const CheckboxMulti = document.querySelector("[checkbox-multi]")
        const inputChecked = CheckboxMulti.querySelectorAll("input[name='id']:checked")
        const typeChange = e.target.elements.type.value
        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn chắc chắn muốn xoá sản phẩm không?")
            if (!isConfirm) {
                return
            }
        }
        if (inputChecked.length > 0) {
            let Ids = []
            inputChecked.forEach(input => {
                const id = input.value
                if (typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value
                    Ids.push(`${id}-${position}`)
                }
                else {
                    Ids.push(input.value)
                }
            })
            const inputSubmit = formChangeMulti.querySelector("input[name='ids']")
            inputSubmit.value = Ids.join(", ")
            formChangeMulti.submit()
        } else {
            alert("Vui lòng chọn ít nhất 1 sản phẩm")
        }

    })
}
//End ChangeMulti

// Show alert
const showAlert = document.querySelector("[show-alert]")
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"))
    const closeAlert = showAlert.querySelector("[close-alert]")

    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time)
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden")
    })
}
// End show alect
// Upload Image
const uploadImage = document.querySelectorAll("[upload-image]")
if (uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]")
    const uploadImagePreview = document.querySelector("[upload-image-preview]")
    const btnRemoveImage = document.querySelector("[remove-image]")
    if (uploadImageInput) {
        uploadImageInput.addEventListener("change", (e) => {
            const file = e.target.files[0]
            if (file) {
                uploadImagePreview.src = URL.createObjectURL(file)
            }
            btnRemoveImage.style.display = "flex";

        })
        btnRemoveImage.addEventListener("click", (e) => {
            uploadImageInput.value = ""
            uploadImagePreview.src = ""
            btnRemoveImage.style.display = "none";
        })
    }


}
// End Upload Image

// Sort
const sort = document.querySelector("[sort]")
if (sort) {
    let url = new URL(window.location.href)
    const sortSelect = sort.querySelector("[sort-select]")
    const sortClear = document.querySelector("[sort-clear]")
    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value
        const [sortKey, sortValue] = value.split("-")

        url.searchParams.set("sortKey", sortKey)
        url.searchParams.set("sortValue", sortValue)
        window.location.href = url.href
    })

    sortClear.addEventListener("click", (e) => {
        url.searchParams.delete("sortKey")
        url.searchParams.delete("sortValue")
        window.location.href = url.href
    })
    const sortKey = url.searchParams.get("sortKey")
    const sortValue = url.searchParams.get("sortValue")
    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`
        console.log()
        const selectOption = sortSelect.querySelector(`option[value='${stringSort}']`)
        selectOption.selected = true
    }

}
// End Sort