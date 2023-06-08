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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const jwt_guard_1 = require("../../guards/jwt.guard");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    cartegoryData() {
        return;
    }
    async findAllCategory(params, req, res) {
        const { page, pageSize } = params;
        const { data, totaldata } = await this.categoryService.getAllCategory(Number(page), Number(pageSize));
        return res.status(200).json({
            data: data,
            totaldata: totaldata,
            errmsg: '',
            status: 200,
        });
    }
    async findCategory(req, res) {
        const data = await this.categoryService.getAllCategories();
        return res.status(200).json({
            data: data,
            errmsg: '',
            status: 200,
        });
    }
    async addCategory(categoryRes, req, res) {
        const responsedata = await this.categoryService.addCategory(categoryRes);
        if (responsedata.status == 403) {
            return res.status(200).json({
                data: '',
                errmsg: 'already have !',
                status: 403,
            });
        }
        return res.status(200).json({
            data: responsedata.data,
            errmsg: '',
            status: 200,
        });
    }
    async updatecategory(updateRes, id, req, res) {
        const responsedata = await this.categoryService.updateData(updateRes, id);
        if (responsedata.status == 403) {
            return res.status(200).json({
                data: '',
                errmsg: 'already have !',
                status: 403,
            });
        }
        return res.status(200).json({
            data: responsedata.updateData,
            errmsg: '',
            status: 200,
        });
    }
    async deleteCategory(id, req, res) {
        const data = await this.categoryService.deleteData(id);
        return res.status(200).json({
            data: data,
            errmsg: '',
            status: 200,
        });
    }
    async search(params, req, res) {
        const { categories, totalData } = await this.categoryService.searchCategories(params.value, Number(params.page), Number(params.pageSize));
        return res.status(200).json({
            data: categories,
            errmsg: '',
            status: 200,
            totaldata: totalData,
        });
    }
    async fetchCategory(req, res) {
        const categorydata = await this.categoryService.categoryListing(req);
        console.log(categorydata);
        res.json({
            data: categorydata.user,
            recordsTotal: categorydata.user.length,
            recordsFiltered: categorydata.count.length,
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard),
    (0, common_1.Get)(),
    (0, common_1.Render)('category'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoryController.prototype, "cartegoryData", null);
__decorate([
    (0, common_1.Get)('allCategories'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findAllCategory", null);
__decorate([
    (0, common_1.Get)('getCategory'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findCategory", null);
__decorate([
    (0, common_1.Post)('addCategory'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto, Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "addCategory", null);
__decorate([
    (0, common_1.Patch)('updateCategory/:id'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "updatecategory", null);
__decorate([
    (0, common_1.Delete)('deleteCategory/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('/search'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('datatable'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "fetchCategory", null);
CategoryController = __decorate([
    (0, common_1.Controller)('category'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map