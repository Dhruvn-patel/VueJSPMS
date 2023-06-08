/* eslint-disable prettier/prettier */
async function deleteItems(ele) {
    console.log(ele.id);
    const submitdata = await fetch(`/cart/deleteData/${ele.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const response = await submitdata.json();
    console.log(response);
    if (response.status == 200) {
        alert("product deleted into cart ")
    }
    window.location.reload();
}

async function orderAdd() {
    const submitdata = await fetch(`/cart/OrderAdd`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({

        })
    })
    const response = await submitdata.json();
    console.log(response);


    const softdelete = await fetch(`/cart/deletesoft`);
    const softdeleteJson = await softdelete.json();
    console.log("softdeleteJson", softdeleteJson);
    if (response) {
        window.location.href = '/cart/order'

    }



}
async function changeValues(element, type) {
    const productId = element.id;
    const quantityElement = document.getElementById(productId);
    const submitdata = await fetch(`/cart/updateQuantity/${element.id}`)
    const response = await submitdata.json();
    console.log(response, "response");
    let IncrementValue = parseInt(response.data.Quantity)
    const quantity = document.getElementById(`quantity_${productId}`);
    if (type == 'plus')
        IncrementValue++;
    else
        IncrementValue--;
    if (IncrementValue <= 0) {
        return;
    }
    else {
        quantity.innerHTML = IncrementValue
        const cartQuantity = await fetch(`/cart/updateQuantity?productId=${element.id}&quantity=${IncrementValue}`)
        const data = cartQuantity.json();
    }
    let totaldata = document.getElementById(`total_${productId}`);
    let totalPrice;
    let priceProduct = document.getElementById(`price_${productId}`);
    console.log(priceProduct.innerHTML);
    if (type == 'plus') {

        totalPrice = IncrementValue * parseInt(priceProduct.innerHTML.trim());
    }
    else {
        totalPrice = IncrementValue * parseInt(priceProduct.innerHTML.trim());
    }
    totaldata.innerHTML = `${totalPrice}`
}




async function orderSubmit() {
    const addQuantity = await fetch(`/cart/orderUpdate`);
    const responsedata = await addQuantity.json();
    if (responsedata) {
        window.location.href = '/cart/history'
    }
}



