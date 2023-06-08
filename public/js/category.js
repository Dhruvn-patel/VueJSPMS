async function userData(page) {
    const pageSize = 5
    const response = await fetch(`/category/AllCategories?page=${page}&pageSize=${pageSize}`);
    alluserData = await response.json();
    // if (alluserData.status === 200) {
    //     let userArray = []
    //     userArray = alluserData.data

    //     let htmldata = '';
    //     userArray.map((element, i) => {
    //         htmldata += `<tr>
    //         <td>${i + 1}</td>
    //         <td>${element.id}</td>
    //         <td>${element.name}</td>
    //      <td class="mr-2"> <a id="${element.id}" class="d-inline  btn btn-danger"onClick="deleteData(this)">
    //      delete
    //     </a>
    //     </td><td>
    //     <a id="${element.id}" class="d-inline p-2 btn btn-primary"onClick="updateData(this);showModal();">
    //      edit
    //     </a>
    //     <td/>
    //    </tr> `
    //     });
    //     let resultdata = document.querySelector('.userData');
    //     resultdata.innerHTML = htmldata;


    //     const totalPages = Math.ceil(alluserData.totaldata / pageSize);
    //     const paginationContainer = document.querySelector('.pagination');
    //     paginationContainer.innerHTML = '';

    //     for (let i = 1; i <= totalPages; i++) {
    //         const li = document.createElement('li');
    //         li.classList.add('page-item');
    //         if (i === page) {
    //             li.classList.add('active');
    //         }
    //         const a = document.createElement('a');
    //         a.classList.add('page-link');
    //         a.href = '#';
    //         a.textContent = i;
    //         a.onclick = () => {
    //             userData(i);
    //         };
    //         li.appendChild(a);
    //         paginationContainer.appendChild(li);
    //     }
    // }
}
userData(1)
const createbtn = document.getElementById("createbtn");
const categorynameErr = document.getElementById("categoryname-err");
let validateCategoryName_flag = 0;
function showCreateModal() {
    var userModel = document.getElementById("create-model");
    userModel.classList.add("show");
    userModel.style.display = "block";
    userModel.classList.add("modal-open");
}

function disableCreateModal() {
    var userModel = document.getElementById("create-model");
    userModel.classList.remove("show");
    userModel.style.display = "none";
    categorynameErr.innerHTML = ""
    userModel.classList.remove("modal-open");
}

const categoryname = document.getElementById("categoryname");
async function validateCategoryName() {

    if (categoryname.value.trim() == '') {
        categorynameErr.innerHTML = 'Please enter Category Name';
        validateCategoryName_flag = 0;
    }
    else {
        categorynameErr.innerHTML = "";
        validateCategoryName_flag = 1;

    }
    createCategoryData();
}

function createCategoryData() {
    if (validateCategoryName_flag == 1) {
        categorynameErr.innerHTML = "";
        enableBtn();

    } else {
        disableBtn();
    }
}

async function createData() {
    const responsedata = await fetch('/category/addCategory', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: categoryname.value.trim(),

        })
    })
    const results = await responsedata.json();

    if (results.status == 200) {
        alert('category added successfully');

    }
    else if (results.status == 403) {
        alert('category already exists !')
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
    const submitForm = await fetch(`/category/deleteCategory/${ele.id}`, {
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
        // userData(1)
    }
    else if (results.status === 403) {
        alert('admin user is not deleted');
        // userData(1)
    }

}
let updatedId;
const username = document.getElementById("username");

let userdata;
async function updateData(ele) {
    updatedId = Number(ele.id);
    userdata = alluserData.data.filter((user) => user.id == ele.id);
    console.log("userdata", userdata);
    username.value = userdata[0].name;
    validateInfo()
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
        alert('user updated successfully')
    }
    else if (results.status == 403) {
        alert('user already exists !')
    }

    disableModal()
    return true;
}


function showModal() {
    var userModel = document.getElementById("editcatmodel");
    userModel.classList.add("show");
    userModel.style.display = "block";
    userModel.classList.add("modal-open");
}

function disableModal() {
    var userModel = document.getElementById("editcatmodel");
    userModel.classList.remove("show");
    userModel.style.display = "none";
    usernameErr.innerHTML = ""

    userModel.classList.remove("modal-open");
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
    const responsedata = await fetch(`/category/search?value=${searchdata}&page=${page}&pageSize=${pageSize}`);
    const alluserData = await responsedata.json();
    document.querySelector('.userData').innerHTML = '';
    if (alluserData.status === 200) {
        let userArray = []
        userArray = alluserData.data
        let htmldata = '';
        userArray.map((element, i) => {
            htmldata += `<tr>
            <td>${i + 1}</td>
            <td>${element.id}</td>
            <td>${element.name}</td>
         <td class="mr-2"> <a id="${element.id}" class="d-inline  btn btn-danger"onClick="deleteData(this)">
         delete
        </a>
        </td><td>
        <a id="${element.id}" class="d-inline p-2 btn btn-primary"onClick="updateData(this);showModal();">
         edit
        </a>
        <td/>
       </tr> `
        });
        let resultdata = document.querySelector('.userData');
        resultdata.innerHTML = htmldata;

        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(alluserData.totaldata / pageSize);
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
// userData(1);


// datatables 
$(document).ready(function () {
    $('#myTable').DataTable({
        lengthMenu: [
            [5, 10, 15, 20,],
            [5, 10, 15, 20,],
        ],
        processing: true,
        serverSide: true,
        ajax: {
            url: '/category/datatable',
            type: 'get',
        },
        columns: [
            { data: 'id' },
            { data: 'name' },
            {
                data: 'id',
                render: function (data) {
                    return (
                        '<input type="button" value="Edit" class="btn btn-primary" id="' +
                        data +
                        '" onclick="updateData(this);showModal();"/>'
                    );
                },
                orderable: false
            },
            {
                data: 'id',
                render: function (data) {
                    return (
                        '<input type="button" class="btn btn-danger" value="Delete" id="' +
                        data +
                        '" onclick="deleteData(this)"/>'
                    );
                },
                orderable: false
            },

        ],

    });
});




