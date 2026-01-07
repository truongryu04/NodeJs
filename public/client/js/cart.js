// Cập nhật lại số lượng sản phẩm giỏ hàng
const inputQuantity = document.querySelectorAll("input[name = 'quantity']")
if (inputQuantity.length > 0) {
    inputQuantity.forEach(input => {
        input.addEventListener("change", () => {
            const product_id = input.getAttribute("product-id")
            console.log(product_id)
            const newQuantity = input.value
            console.log(newQuantity)
            window.location.href = `/cart/update/${product_id}/${newQuantity}`
        })
    })
}