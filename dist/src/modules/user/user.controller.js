"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const jwt_guard_1 = require("../../guards/jwt.guard");
const jwt_1 = require("@nestjs/jwt");
let UserController = class UserController {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async create(createUserDto, req, res) {
        const data = await this.userService.create(createUserDto, createUserDto.rolesId);
        if (data.errorCode == 409) {
            return res.status(409).json({
                errmsg: 'Email is already registered',
                data: null,
                status: 409,
            });
        }
        return res.status(200).json({
            data: data,
            errmsg: '',
            status: 200,
        });
    }
    AllUsers() {
        return;
    }
    async findAll(req, res) {
        const { data, totaldata } = await this.userService.findAll();
        return res.status(200).json({
            data: data,
            totaldata: totaldata,
            errmsg: '',
            status: 200,
        });
    }
    async searchUsers(params, req, res) {
        const { categories, totalData } = await this.userService.searchCategories(params.value, Number(params.page), Number(params.pageSize));
        console.log(categories, totalData);
        return res.status(200).json({
            data: categories,
            errmsg: '',
            status: 200,
            totaldata: totalData,
        });
    }
    async update(id, updatedata, req, res) {
        const token = req.headers.authorization.split(' ')[1];
        const dataget = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET_USER,
        });
        const { email } = dataget;
        console.log(email);
        const data = await this.userService.update(id, updatedata);
        console.log('data email', data.email, email);
        if (data.email === email) {
            try {
                res.status(403).json({
                    errmsg: 'admin user updated !',
                    data: null,
                    status: 403,
                });
            }
            catch (error) {
                return error;
            }
        }
        else if (data.statusCode === 200) {
            return res.json({
                errmsg: '',
                status: 200,
                data: null,
            });
        }
    }
    async remove(id, req, res) {
        const data = await this.userService.remove(id);
        if (data.statusCode === 403) {
            try {
                return res.status(403).json({
                    errmsg: 'admin account currently logined!',
                    status: 403,
                    data: null,
                });
            }
            catch (error) {
                return error;
            }
        }
        else if (data.statusCode === 200) {
            return res.json({
                errmsg: '',
                status: 200,
                data: null,
            });
        }
    }
    async datatableUser(req, res) {
        const data = await this.userService.usersDataListing(req);
        let editBtn;
        let deleteBtn;
        let role;
        for (let i = 0; i < data.user.length; i++) {
            if (data.user[i].rolesId == 1) {
                role = `<p>Admin</p>`;
            }
            else {
                role = `<p>User</p>`;
            }
            editBtn = `<input
        type="button"
        value="Edit"
        class="btn btn-primary"
        id="${data.user[i].id}"
        onclick="updateData(this);showModal();"
        />`;
            deleteBtn = `<input
        type="button"
        value="Delete"
        class="btn btn-danger"
        id="${data.user[i].id}"
        onclick="deleteData(this)"
        />`;
            data.user[i]['role'] = role;
            data.user[i]['edit'] = editBtn;
            data.user[i]['delete'] = deleteBtn;
        }
        res.json({
            data: data.user,
            recordsTotal: data.user.length,
            recordsFiltered: data.count.length,
        });
    }
};
__decorate([
    (0, common_1.Post)('/addUser'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard),
    (0, common_1.Get)(''),
    (0, common_1.Render)('user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "AllUsers", null);
__decorate([
    (0, common_1.Get)('getUsers'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchUsers", null);
__decorate([
    (0, common_1.Patch)('update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('remove/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ValidationPipe())),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('datatable'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "datatableUser", null);
UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map