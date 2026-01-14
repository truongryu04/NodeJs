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
