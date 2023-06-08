/* eslint-disable prettier/prettier */
let searchdata;
let selectedValue = 0;
async function userData() {
    const response = await fetch(`/category/getCategory`);
    alluserData = await response.json();
    if (alluserData.status === 200) {
        let userArray = []
        userArray = alluserData.data
        let htmldata = '';
        let resultdata = document.querySelector('#category-group');
        resultdata.innerHTML = '';

        const option = document.createElement("option");
        option.textContent = "Select Categories";
        resultdata.appendChild(option)
        userArray.map((element, i) => {
            const option = document.createElement("option");
            option.value = element.id;
            option.textContent = element.name;
            resultdata.appendChild(option)
        });
    }
}
userData()

async function sortByPrice(ele) {
    const data = document.getElementById("sort").options[document.getElementById("sort").selectedIndex].value;
    const response = await fetch(`/products/listProduct?sortType=${data}&searchValue=&id=${selectedValue}`);
    const allProductData = await response.json();
    if (allProductData.status === 200) {
        let userArray = []
        userArray = allProductData.data.products
        document.getElementById('res').innerHTML = userArray.length;
        let htmldata = '';
        userArray.map((element, i) => {
            let categoryhtml = '';
            htmldata += `
            <div class=" offset-md-0 offset-sm-1 border m-1" >
            <div class="card mb-3">
                <img class="card-img-top imgwidth" src="/uploads/${element.image}">
                <div class="card-body ">
                    <h5><b>
                        ${element.ProductName}
                        </b></h5>
                    <div class="d-flex flex-row ">
                        <div class="product-description">
                            <p>
                            ${element.description}
                            </p>
                        </div>
                    </div>

                    <div class="d-flex flex-row ">
                        <div class="product-tags">
                            <p>Categories:`

            element.categoryNames.forEach(function (category) {
                categoryhtml += `<span class="tag">
                   ${category}
                </span>`
            })
            categoryhtml += ` </p>
                       </div>
                    </div>
                    <div class="d-flex flex-row ">
                        <div class="text-muted">₹  ${element.price}
                        </div>
                    </div>
                    <div class="d-flex flex-row ">
                     <a class="btn btn-primary w-100 rounded " id=" ${element.id}" onclick="addToCart(this)">Add to
                                cart</a>
                    </div>
                </div>
            </div>
        </div><br />
        `
            htmldata += categoryhtml
        });
        let resultdata = document.querySelector('.coldata');
        resultdata.innerHTML = htmldata;
    }
}
async function handleCategorySelect() {
    const selectElement = document.getElementById("category-group");
    selectedValue = selectElement.value;

    const response = await fetch(`/products/listProduct?sortType=asc&searchValue=${searchdata}&id=${selectedValue}`);
    allProductData = await response.json();
    if (allProductData.status === 200) {
        let userArray = []
        userArray = allProductData.data.products
        document.getElementById('res').innerHTML = userArray.length;

        let htmldata = '';
        userArray.map((element, i) => {
            let categoryhtml = '';
            htmldata += `
            <div class=" offset-md-0 offset-sm-1 border m-1" >
            <div class="card mb-3">
                <img class="card-img-top imgwidth" src="/uploads/${element.image}">
                <div class="card-body ">
                    <h5><b>
                        ${element.ProductName}
                        </b></h5>
                    <div class="d-flex flex-row ">
                        <div class="product-description">
                            <p>
                            ${element.description}
                            </p>
                        </div>
                    </div>

                    <div class="d-flex flex-row ">
                        <div class="product-tags">
                            <p>Categories:`

            element.categoryNames.forEach(function (category) {
                categoryhtml += `<span class="tag">
                   ${category}
                </span>`
            })
            categoryhtml += ` </p>
                       </div>
                    </div>
                    <div class="d-flex flex-row ">
                        <div class="text-muted">₹  ${element.price}
                        </div>
                    </div>
                    <div class="d-flex flex-row ">
                     <a class="btn btn-primary w-100 rounded " id=" ${element.id}" onclick="addToCart(this)">Add to
                                cart</a>
                    </div>
                </div>
            </div>
        </div><br />
        `
            htmldata += categoryhtml
        });
        let resultdata = document.querySelector('.coldata');
        resultdata.innerHTML = htmldata;
    }
}
async function productListing() {
    const response = await fetch(`/products/listProduct?sortType=asc&searchValue=${searchdata}&id=${selectedValue}`);
    allProductData = await response.json();

    if (allProductData.status === 200) {
        let userArray = []
        userArray = allProductData.data.products
        document.getElementById('res').innerHTML = userArray.length;
        let htmldata = '';
        userArray.map((element, i) => {
            let categoryhtml = '';
            htmldata += `
            <div class=" offset-md-0 offset-sm-1 border m-1" >
            <div class="card mb-3">
                <img class="card-img-top imgwidth" src="/uploads/${element.image}">
                <div class="card-body ">
                    <h5><b>
                        ${element.ProductName}
                        </b></h5>
                    <div class="d-flex flex-row ">
                        <div class="product-description">
                            <p>
                            ${element.description}
                            </p>
                        </div>
                    </div>

                    <div class="d-flex flex-row ">
                        <div class="product-tags">
                            <p>Categories:`

            element.categoryNames.forEach(function (category) {
                categoryhtml += `<span class="tag">
                   ${category}
                </span>`
            })
            categoryhtml += ` </p>
                       </div>
                    </div>
                    <div class="d-flex flex-row ">
                        <div class="text-muted">₹  ${element.price}
                        </div>
                    </div>
                    <div class="d-flex flex-row ">
                     <a class="btn btn-primary w-100 rounded " id=" ${element.id}" onclick="addToCart(this)">Add to
                                cart</a>
                    </div>
                </div>
            </div>
        </div><br />
        `
            htmldata += categoryhtml
        });
        let resultdata = document.querySelector('.coldata');
        resultdata.innerHTML = htmldata;
    }
}
productListing()
/* 


*/


async function addToCart(ele) {

    const submitdata = await fetch(`/cart/addIntoCart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productId: ele.id
        })

    })
    const response = await submitdata.json();
    if (response.status == 403) {
        const submitdata = await fetch(`/cart/updateQuantity/${ele.id}`)
        const response = await submitdata.json();
        let IncrementValue = parseInt(response.data.Quantity)
        IncrementValue++;
        const cartQuantity = await fetch(`/cart/updateQuantity?productId=${ele.id}&quantity=${IncrementValue}`)
        console.log("Product added");
        alert("product  increment into cart ")
    }
    if (response.status == 200) {
        alert("product  added into cart ")
    }

}
async function searchQuery(ele, page) {
    searchdata = ele.value.trim();
    const pageSize = 5;
    const responsedata = await fetch(`/products/listProduct?sortType=asc&searchValue=${searchdata}&id=${selectedValue}`);
    const alluserData = await responsedata.json();

    document.querySelector('.coldata').innerHTML = '';

    if (alluserData.status === 200) {
        let userArray = []
        userArray = alluserData.data.products
        document.getElementById('res').innerHTML = userArray.length;
        let htmldata = '';
        userArray.map((element, i) => {
            let categoryhtml = '';
            htmldata += `
                <div class=" offset-md-0 offset-sm-1 border m-1" >
                <div class="card mb-3"> 
                    <img class="card-img-top imgwidth" src="/uploads/${element.image}">
                    <div class="card-body ">
                        <h5><b>
                            ${element.ProductName}
                            </b></h5>
                        <div class="d-flex flex-row ">
                            <div class="product-description">
                                <p>
                                ${element.description}
                                </p>
                            </div>
                        </div>
    
                        <div class="d-flex flex-row ">
                            <div class="product-tags">
                                <p>Categories:`

            element.categoryNames.forEach(function (category) {
                categoryhtml += `<span class="tag">
                       ${category}
                    </span>`
            })
            categoryhtml += ` </p>
                           </div>
                        </div>
                        <div class="d-flex flex-row ">
                            <div class="text-muted">₹  ${element.price}
                            </div>
                        </div>
                        <div class="d-flex flex-row ">
                         <a class="btn btn-primary w-100 rounded " id=" ${element.id}" onclick="addToCart(this)">Add to
                                    cart</a>
                        </div>
                    </div>
                </div>
            </div><br />
            `
            htmldata += categoryhtml
        });
        let resultdata = document.querySelector('.coldata');
        resultdata.innerHTML = htmldata;
    }
}


