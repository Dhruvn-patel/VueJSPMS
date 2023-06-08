/* eslint-disable prettier/prettier */
let catagories = [];
async function userData(id) {
    const response = await fetch('/category/getCategory');
    alluserData = await response.json();
    if (alluserData.status === 200) {
        let userArray = []
        userArray = alluserData.data
        catagories = alluserData.data
        let htmldata = '';
        userArray.map((element, i) => {
            htmldata += `<option value=${element.id} name>${element.name}</option>`
        });
        let resultdata = document.querySelector(`#${id}`);
        resultdata.innerHTML = htmldata;
    }
}
allProduct(1)
let productdata;
async function allProduct(page) {
    const pageSize = 5
    const response = await fetch(`/products/allProducts?page=${page}&pageSize=${pageSize}`);
    alluserData = await response.json();
    if (alluserData.status === 200) {
        let userArray = []
        userArray = alluserData.data
        productdata = alluserData.data
        let htmldata = '';
        userArray.map((element, i) => {
            let category = '';
            htmldata += `<tr>
                <td>${i + 1}</td>
                <td>${element.id}</td>
                <td>${element.ProductName}</td>
                <td>${element.description}</td>
                <td><img src='/uploads/${element.image}' class="imgwidth"></td>
                <td>${element.price}</td>
                <td>${element.quantity}</td>
                <td><div class="product-tags"> `
            element.categoryNames.forEach(function (value) {
                category += `<div class="tags mb-2 rounded">
                ${value}
             </div> `
            })
            category += `</div>
            </td>
            <td class="mb-5"><div class="mb-4"><a id="${element.id}" class="d-inline  btn btn-danger"onClick="deleteData(this)">
            delete
           </a></div>
       <div> <a id="${element.id}" class="d-inline p-2 btn btn-primary" onClick="updateData(this);showModal();">
       edit
      </a></div>
        </td>
            </tr>`
            htmldata += category;
        });
        let resultdata = document.querySelector('.userData');
        resultdata.innerHTML = htmldata;
        const totalPages = Math.ceil(alluserData.totaldata / pageSize);
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.classList.add('page-item');
            if (i === page) {
                li.classList.add('active');
            }
            const a = document.createElement('a');
            a.classList.add('page-link');
            a.href = '#';
            a.textContent = i;
            a.onclick = () => {
                allProduct(i);
            };
            li.appendChild(a);
            paginationContainer.appendChild(li);
        }

    }
}
const createbtn = document.getElementById("createbtn");
const categorynameErr = document.getElementById("categoryname-err");
const categorydescErr = document.getElementById("categorydesc-err");
const categoryimageErr = document.getElementById("categoryimage-err");
const categorypriceErr = document.getElementById("categoryprice-err");
const categoryselectErr = document.getElementById("categoryselect-err");
const categoryquantityErr = document.getElementById("categoryquantity-err");
let validateProductName_flag = 0,
    validateProductDesc_flag = 0,
    validateProductImage_flag = 0,
    validateProductPrice_flag = 0,
    validateProductSelect_flag = 0,
    validateProductQuantity_flag = 0
    ;
function showCreateModal() {
    var userModel = document.getElementById("create-model");
    userModel.classList.add("show");
    userModel.style.display = "block";
    userModel.classList.add("modal-open");
    userData('categoryselect');
}

function disableCreateModal() {
    var userModel = document.getElementById("create-model");
    userModel.classList.remove("show");
    userModel.style.display = "none";
    categorynameErr.innerHTML = ""
    userModel.classList.remove("modal-open");
}

let categoryname = document.getElementById("categoryname");
async function validateCategoryName() {

    // let res = await fetch(`/exams/checkcategoryname?categoryname=${categoryname}`);
    if (categoryname.value.trim() == '') {
        categorynameErr.innerHTML = 'Please enter Product Name';
        validateProductName_flag = 0;
    }
    else {
        categorynameErr.innerHTML = "";
        validateProductName_flag = 1;

    }
    createCategoryData();
}
let prouductdesc = document.getElementById("prouductdesc");
async function validateProductDesc() {

    if (prouductdesc.value.trim() == '') {
        categorydescErr.innerHTML = 'Please enter Product Description';
        validateProductDesc_flag = 0;
    }
    else {
        categorydescErr.innerHTML = "";
        validateProductDesc_flag = 1;

    }
    createCategoryData();
}


let formFile = document.getElementById("formFile");
async function validateProductImage() {

    if (formFile.files.length == 0) {
        categoryimageErr.innerHTML = 'Please select Product Image';
        validateProductImage_flag = 0;
    }
    else {
        categoryimageErr.innerHTML = "";
        validateProductImage_flag = 1;

    }
    createCategoryData();
}


let price = document.getElementById("price");
async function validateProductprice() {
    if (price.value == '') {
        categorypriceErr.innerHTML = 'Please enter Product price';
        validateProductPrice_flag = 0;
    }
    else {
        categorypriceErr.innerHTML = "";
        validateProductPrice_flag = 1;

    }
    createCategoryData();
}
let quantity = document.getElementById("quantity");
async function validateProductQunatity() {

    if (quantity.value == '') {
        categoryquantityErr.innerHTML = 'Please enter Product quantity';
        validateProductQuantity_flag = 0;
    }
    else {
        categoryquantityErr.innerHTML = "";
        validateProductQuantity_flag = 1;

    }
    createCategoryData();
}
let categoryselect = document.getElementById("categoryselect");
async function validateSelect() {

    if (categoryname.value.trim() == '') {
        categorynameErr.innerHTML = 'Please select category ';
        validateProductName_flag = 0;
    }
    else {
        categorynameErr.innerHTML = "";
        validateProductName_flag = 1;

    }
    createCategoryData();
}


function createCategoryData() {

    if (validateProductName_flag == 1 && validateProductPrice_flag == 1 && validateProductQuantity_flag == 1 && validateProductDesc_flag == 1) {
        categorynameErr.innerHTML = "";
        enableBtn();

    } else {
        disableBtn();
    }
}

async function createData() {
    const selectedValues = Array.from(categoryselect.querySelectorAll("option"))
        .filter(option => option.selected)
        .map(option => option.value);
    const categorystring = selectedValues.join(", ");
    const formData = new FormData();
    formData.append('file', formFile.files[0]);
    formData.append('ProductName', categoryname.value.trim());
    formData.append('description', prouductdesc.value.trim());
    formData.append('price', price.value);
    formData.append('quantity', quantity.value);
    formData.append('catagory', categorystring);



    const responsedata = await fetch('/products/newAddProduct', {
        method: 'POST',
        headers: {
        },
        body: formData
    })
    const results = await responsedata.json();

    if (results.status == 200) {
        alert('Product added successfully');
        // userData('categoryselect')

    }

    categoryname.value = ''
    disableCreateModal()
}
function disableBtn() {
    createbtn.disabled = true;
}

function enableBtn() {
    createbtn.disabled = false;
}
let alluserData;
const userBtn = document.getElementById("usersBtn");
const durationErr = document.getElementById("duration-err");
const usernameErr = document.getElementById("username-err");

let validateName_flag = 1, validateMail_flag = 1;


async function deleteData(ele) {
  
    const submitForm = await fetch(`/products/deleteProduct/${ele.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: ele.id
        })
    })
    const results = await submitForm.json();
    if (results.status === 200) {
        alert('user deleted successfully');
        allProduct(1)
    }
    else if (results.status === 403) {
        alert('admin user is not deleted');
        allProduct(1)
    }

}
let updatedId;
const username = document.getElementById("username");

let userdata;
const updatecategoryname = document.getElementById("updatecategoryname")
const updateprouductdesc = document.getElementById("updateprouductdesc")
const updateformFile = document.getElementById("updateformFile")
const updateprice = document.getElementById("updateprice")
const updatequantity = document.getElementById("updatequantity")
const updatecategory = document.getElementById("updatecategoryselect");
let productSelectedId;

async function updateSubmit() {

    const selectedValues = Array.from(updatecategory.querySelectorAll("option"))
        .filter(option => option.selected)
        .map(option => option.value);
    const categorystring = selectedValues.join(", ");
  

    const formData = new FormData();
    formData.append('file', updateformFile.files[0]);
    formData.append('ProductName', updatecategoryname.value.trim());
    formData.append('description', updateprouductdesc.value.trim());
    formData.append('price', updateprice.value);
    formData.append('quantity', updatequantity.value);
    formData.append('catagory', categorystring);
    formData.append('Id', productSelectedId);

    const responsedata = await fetch('/products/updateProduct', {
        method: 'POST',
        headers: {
        },
        body: formData
    })
    const results = await responsedata.json();

    disableModal()
    if (results.status == 200) {
        alert('Product Updated successfully');
    }
}
async function updateData(ele) {
    updatedId = Number(ele.id);
    productSelectedId = updatedId;

    let selecteddata = productdata.filter((data) => data.id == updatedId);

    let imagesproduct = document.getElementById('imgProduct');
    imagesproduct.src = `/uploads/${selecteddata[0].image}`

    updatecategoryname.value = `${selecteddata[0].ProductName}`
    updateprouductdesc.value = `${selecteddata[0].description}`
    updateprice.value = `${selecteddata[0].price}`
    updatequantity.value = `${selecteddata[0].quantity}`

    let ids = [];

    selecteddata[0].categoryNames.forEach((data) => {
        catagories.map((category) => {
            if (category.name == data) {
                ids.push(category.id);
            }
        })
    })

    let i = 0;
    const selectedValues = Array.from(document.querySelectorAll("#updatecategoryselect option"))

    selectedValues.forEach((option) => {
        if (ids.includes(Number(option.value))) {
            option.selected = true
        }
    })


}

async function dataUpdate() {
    const submitForm = await fetch(`/category/updateCategory/${updatedId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: username.value,
        })
    })

    const results = await submitForm.json();
    if (results.status == 200) {
        alert('user updated successfully');
        allProduct(1)
    }

    disableModal()
    return true;
}


userData('updatecategoryselect');
function showModal() {
    var userModel = document.getElementById("editmodel");
    userModel.classList.add("show");
    userModel.style.display = "block";
    userModel.classList.add("modal-open");
    // userData('updatecategoryselect');
}

function disableModal() {
    var userModel = document.getElementById("editmodel");
    userModel.classList.remove("show");
    userModel.style.display = "none";
    userModel.classList.remove("modal-open");
    // userData('updatecategoryselect');
}

async function validateName() {

    if (username.value.trim() == '') {
        usernameErr.innerHTML = 'Please enter Name';
        validateName_flag = 0;
    }
    else {
        usernameErr.innerHTML = "";
        validateName_flag = 1;
    }
    validateInfo();
}

function validateInfo() {
    if (validateName_flag == 1) {

        usernameErr.innerHTML = "";
        EditenableBtn();
    } else {
        EditdisableBtn();
    }
}

function EditdisableBtn() {
    userBtn.disabled = true;
}

function EditenableBtn() {
    userBtn.disabled = false;
}


async function searchQuery(ele, page) {
    const searchdata = ele.value.trim();
    const pageSize = 5;
    const responsedata = await fetch(`/products/search?value=${searchdata}&page=${page}&pageSize=${pageSize}`);
    const alluserData = await responsedata.json();

    document.querySelector('.userData').innerHTML = '';

    if (alluserData.status === 200) {
        let userArray = []
        userArray = alluserData.data
        let htmldata = '';
        userArray.map((element, i) => {
            let category = '';
            htmldata += `<tr>
                <td>${i + 1}</td>
                <td>${element.id}</td>
                <td>${element.ProductName}</td>
                <td>${element.description}</td>
                <td><img src='/uploads/${element.image}' class="imgwidth"></td>
                <td>${element.price}</td>
                <td>${element.quantity}</td>
                <td><div class="product-tags"> `
            element.categoryNames.forEach(function (value) {
                category += `<div class="tags mb-2 rounded">
                ${value}
             </div> `
            })
            category += `</div>
            </td>
            <td class="mb-5"><div class="mb-4"><a id="${element.id}" class="d-inline  btn btn-danger"onClick="deleteData(this)">
            delete
           </a></div>
       <div> <a id="${element.id}" class="d-inline p-2 btn btn-primary"onClick="updateData(this);showModal();">
       edit
      </a></div>
        </td>
            </tr>`
            htmldata += category;
        });
        let resultdata = document.querySelector('.userData');
        resultdata.innerHTML = htmldata;


        const totalPages = Math.ceil(alluserData.totaldata % alluserData.data.length);
        // const totalPages = alluserData.data.length;

        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.classList.add('page-item');
            if (i === page) {
                li.classList.add('active');
            }
            const a = document.createElement('a');
            a.classList.add('page-link');
            a.href = '#';
            a.textContent = i;
            a.onclick = () => {
                searchQuery(ele, i);
            };
            li.appendChild(a);
            paginationContainer.appendChild(li);
        }
    }
}


