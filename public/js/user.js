/* eslint-disable prettier/prettier */
let alluserData;
const userBtn = document.getElementById("usersBtn");
const createBtn = document.getElementById("createBtn");
const totalqueErr = document.getElementById("totalque-err");
const useremailErr = document.getElementById("useremail-err");
const durationErr = document.getElementById("duration-err");
const usernameErr = document.getElementById("username-err");
const createnameErr = document.getElementById("createnameErr");
const createmailErr = document.getElementById("createmailErr");
const passwordErr = document.getElementById("passwordErr");
const passwordConfirmErr = document.getElementById("passwordConfirmErr");
userData(1);
let validateName_flag = 1, validateMail_flag = 1, validatePassword_flag = 0;
let validateCreateName_flag = 0, validateCreateMail_flag = 0;
async function userData(page) {
    const pageSize = 5
    const response = await fetch(`/users/getUsers?page=${page}&pageSize=${pageSize}`);
    alluserData = await response.json();
    // if (alluserData.status === 200) {
    //     let userArray = []
    //     userArray = alluserData.data

    //     let htmldata = '';
    //     userArray.map((element, i) => {
    //         let tabledata = `<tr>
    //                 <td>${i + 1}</td>
    //                 <td>${element.id}</td>
    //                 <td>${element.name}</td>
    //                 <td>${element.email}</td>
    //         `
    //         let tdroles = '';
    //         if (element.rolesId == 1) {
    //             tdroles = ` <td>Admin</td>`
    //         }
    //         else {
    //             tdroles = `<td>User</td > `
    //         }
    //         let rolesData =
    //             ` <td> <a id="${element.id}" class="d-inline p-2  btn btn-danger"onClick="deleteData(this)">
    //              delete
    //             </a>
    //             </td>
    //             <td>
    //             <a id="${element.id}" class="d-inline p-2 btn btn-primary"onClick="updateData(this);showModal();">
    //              edit
    //             </a>
    //             <td/>
    //         </tr> `
    //         tdroles += rolesData;
    //         tabledata += tdroles;
    //         i++;
    //         htmldata += tabledata;
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

async function deleteData(ele) {

    const submitForm = await fetch(`/users/remove/${ele.id}`, {
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
        userData(1)
    }
    else if (results.status === 403) {
        alert('admin user is not deleted');
        userData(1)
    }

}
let updatedId;
const username = document.getElementById("username");
const useremail = document.getElementById("useremail");
let userdata;
async function updateData(ele) {
    updatedId = Number(ele.id);
    userdata = alluserData.data.filter((user) => user.id == ele.id);
    username.value = userdata[0].name;
    useremail.value = userdata[0].email;
    validateInfo()
}

async function searchQuery(ele, page) {
    const searchdata = ele.value.trim();
    const pageSize = 5;
    const responsedata = await fetch(`/users/search?value=${searchdata}&page=${page}&pageSize=${pageSize}`);
    const alluserData = await responsedata.json();
    document.querySelector('.userData').innerHTML = '';
    if (alluserData.status === 200) {
        let userArray = []
        userArray = alluserData.data

        let htmldata = '';
        userArray.map((element, i) => {
            let tabledata = `<tr>
                    <td>${i + 1}</td>
                    <td>${element.id}</td>
                    <td>${element.name}</td>
                    <td>${element.email}</td>
            `
            let tdroles = '';
            if (element.rolesId == 1) {
                tdroles = ` <td>Admin</td>`
            }
            else {
                tdroles = `<td>User</td > `
            }
            let rolesData =
                ` <td> <a id="${element.id}" class="d-inline p-2  btn btn-danger"onClick="deleteData(this)">
                 delete
                </a>
                </td>
                <td>
                <a id="${element.id}" class="d-inline p-2 btn btn-primary"onClick="updateData(this);showModal();">
                 edit
                </a>
                <td/>
            </tr> `
            tdroles += rolesData;
            tabledata += tdroles;
            i++;
            htmldata += tabledata;
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
const createname = document.getElementById("createname");
const createemail = document.getElementById("createemail");
const createpassword = document.getElementById("createpassword");
const confirmpassword = document.getElementById("confirmpassword");
async function InsertData() {

    const selectedvalue = document.getElementById('roles');
    const roleId = selectedvalue.value;

    const submitForm = await fetch(`/users/addUser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: createname.value,
            email: createemail.value,
            password: createpassword.value,
            rolesId: roleId
        })
    })
    const results = await submitForm.json();

    if (results.status == 200) {
        alert('user Inserted successfully');
    }
    createdisableModal()


}
async function dataUpdate() {
    const submitForm = await fetch(`/users/update/${updatedId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: username.value,
            email: useremail.value
        })
    })

    const results = await submitForm.json();
    if (results.status == 203) {
        alert('Admin updated  successfully');
        location.assign('/signin');
    }
    else if (results.status == 200) {
        alert('user updated successfully');
        userData(1)
    }

    disableModal()
    return true;
}



function showModal() {
    var userModel = document.getElementById("editmodel");
    userModel.classList.add("show");
    userModel.style.display = "block";
    usernameErr.innerHTML = ""
    useremailErr.innerHTML = "";
    userModel.classList.add("modal-open");
}

function disableModal() {
    var userModel = document.getElementById("editmodel");
    userModel.classList.remove("show");
    userModel.style.display = "none";
    usernameErr.innerHTML = ""
    useremailErr.innerHTML = "";
    userModel.classList.remove("modal-open");
}


function showCreateModal() {
    var userModel = document.getElementById("create-model");
    userModel.classList.add("show");
    userModel.style.display = "block";
    userModel.classList.add("modal-open");
    validateCreateMail_flag = 0;
    validateCreateName_flag = 0
}

function createdisableModal() {
    var userModel = document.getElementById("create-model");
    userModel.classList.remove("show");
    userModel.style.display = "none";
    createnameErr.innerHTML = ""
    createmailErr.innerHTML = "";
    userModel.classList.remove("modal-open");
}
async function validateName() {

    if (username.value.trim() == '') {
        usernameErr.innerHTML = 'Please enter Name';
        createnameErr.innerHTML = 'Please enter Name';
        validateName_flag = 0;
        validateCreateName_flag = 0;
    }
    else {
        usernameErr.innerHTML = "";
        validateName_flag = 1;
        validateCreateName_flag = 1;
    }
    validateInfo();
    createDataInfo();
}
function validateEmail() {
    if (useremail.value.trim() == '') {
        useremailErr.innerHTML = 'Please enter email address';
        createmailErr.innerHTML = 'Please enter email address';
        validateMail_flag = 0;
        validateCreateMail_flag = 0;
    }
    else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(useremail.value.trim()))) {
        useremailErr.innerHTML = 'Please enter email address';
        createmailErr.innerHTML = 'Please enter valid email address';
        validateMail_flag = 0;
        validateCreateMail_flag = 0;
    }
    else {
        createmailErr.innerHTML = "";
        validateMail_flag = 1;
        validateCreateMail_flag = 1;
    }
    validateInfo();
    createDataInfo();
}


function validatePassword() {
    if (createpassword.value.length < 8) {
        passwordErr.innerHTML = 'Please enter password';
        validatePassword_flag = 0;
    }
    else if (createpassword.value != confirmpassword.value) {
        passwordConfirmErr.innerHTML = 'Password does not match';
        validatePassword_flag = 0;
    }
    else {
        passwordErr.innerHTML = "";
        passwordConfirmErr.innerHTML = "";
        validatePassword_flag = 1;
    }
    createDataInfo();
}

function validateInfo() {
    if (validateName_flag == 1 && validateMail_flag == 1) {
        useremailErr.innerHTML = "";
        usernameErr.innerHTML = "";
        enableBtn();
    } else {
        disableBtn();
    }
}
function createDataInfo() {

    if (validatePassword_flag == 1) {
        createnameErr.innerHTML = "";
        createmailErr.innerHTML = "";
        createenableBtn();
    }
    else {
        createdisableBtn();
    }
}
function disableBtn() {
    userBtn.disabled = true;
}

function enableBtn() {
    userBtn.disabled = false;
}

function createdisableBtn() {
    createBtn.disabled = true;
}

function createenableBtn() {
    createBtn.disabled = false;
}



$(document).ready(function () {
    $('#myTable').DataTable({
        lengthMenu: [
            [5, 10, 15, 20,],
            [5, 10, 15, 20,],
        ],
        processing: true,
        serverSide: true,
        ajax: {
            url: '/users/datatable',
            type: 'get',
        },
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'email' },
            {
                data: 'role',
                orderable: false
            },
            {
                data: 'edit',
                orderable: false
            },
            { data: 'delete', orderable: false },
        ],

    });
})




/* 

<body>
  <div id="app" class="container">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script>
    new Vue({
      el: '#app',
      data() {
        return {
          users: []
        }
      },
      mounted() {
        this.fetchUsers();
      },
      methods: {
        fetchUsers() {
          axios.get('https://api.example.com/users')
            .then(response => {
              this.users = response.data;
            })
            .catch(error => {
              console.error(error);
            });
        }
      }
    });
  </script>
</body>


*/

