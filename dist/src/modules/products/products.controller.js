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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const swagger_1 = require("@nestjs/swagger");
const category_service_1 = require("../category/category.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const filesconfig_multer_1 = require("./filesconfig.multer");
const jwt_guard_1 = require("../../guards/jwt.guard");
const jwt_1 = require("@nestjs/jwt");
let ProductsController = class ProductsController {
    constructor(productsService, categoryService, jwtService) {
        this.productsService = productsService;
        this.categoryService = categoryService;
        this.jwtService = jwtService;
    }
    getProducts() {
        return;
    }
    async addProductwithFile(file, name, description, price, quantity, categoryIds, req, res) {
        const data = this.productsService.uploadSingleFile(file, name, description, price, quantity, categoryIds);
        return res.status(200).json({
            data: data,
            errmsg: '',
            status: 200,
        });
    }
    async updateProduct(file, name, description, price, quantity, categoryIds, Id, req, res) {
        const data = this.productsService.productUpdateById(file, name, description, price, quantity, categoryIds, Id);
        return res.status(200).json({
            data: data,
            errmsg: '',
            status: 200,
        });
    }
    async newProductWithImg(name, description, price, quantity, categoryIds, file, req, res) {
        const data = this.productsService.addProductWithImg(file, name, description, price, quantity, categoryIds);
        return res.status(200).json({
            data: data,
            errmsg: '',
            status: 200,
        });
    }
    async updateProductWithimg(name, description, price, quantity, categoryIds, file, Id, req, res) {
        const data = await this.productsService.updateProductById(file, name, description, price, quantity, categoryIds, Id);
        return res.status(200).json({
            data: data,
            errmsg: '',
            status: 200,
        });
    }
    async deleteProduct(id, req, res) {
        const data = await this.productsService.deleteProduct(id);
        return res.status(200).json({
            data: data,
            errmsg: '',
            status: 200,
        });
    }
    async findAllProducts(params, req, res) {
        const { page, pageSize } = params;
        const { totalData, productsWithCategory } = await this.productsService.findAllProducts(Number(page), Number(pageSize));
        return res.status(200).json({
            data: productsWithCategory,
            errmsg: '',
            status: 200,
            totaldata: totalData,
        });
    }
    async AllProducts(req, res, params) {
        const { productsWithCategory } = await this.productsService.AllProducts(params.sortType);
        let searchParam = '';
        if (params.searchValue == 'undefined')
            searchParam = '';
        else
            searchParam = params.searchValue;
        console.log('params.searchValue', searchParam, params.sortType, params.id);
        const allDataSearch = await this.productsService.allDataSearch(searchParam, params.sortType, params.id);
        return res.status(200).json({
            data: allDataSearch,
            errmsg: '',
            status: 200,
        });
    }
    async getProductByCategoryId(params, req, res) {
        const result = await this.productsService.categorywiseProduct(Number(params.id));
        return res.status(200).json({
            data: result,
            errmsg: '',
            status: 200,
        });
    }
    async getProduct(params) {
        const data = await this.productsService.getAllProductsWithCategoryById(Number(params.id));
        return data;
    }
    async updateQuantity(params, req, res) {
        const { id, quantity } = params;
        const data = await this.productsService.updateQuantity(id, quantity);
        return res.json({ data });
    }
    async getUsers(req, res) {
        const categories = await this.categoryService.getAllCategory();
        return res.render('products', { categories });
    }
    async searchData(params, req, res) {
        const { products, totalData } = await this.productsService.searchProducts(params.value, Number(params.page), Number(params.pageSize));
        return res.status(200).json({
            data: products,
            errmsg: '',
            status: 200,
            totaldata: totalData,
        });
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard),
    (0, common_1.Get)(),
    (0, common_1.Render)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Post)('/newAddProduct'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: filesconfig_multer_1.destination,
            filename: filesconfig_multer_1.editFileName,
        }),
        fileFilter: filesconfig_multer_1.imageFileFilter,
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('ProductName')),
    __param(2, (0, common_1.Body)('description')),
    __param(3, (0, common_1.Body)('price')),
    __param(4, (0, common_1.Body)('quantity')),
    __param(5, (0, common_1.Body)('catagory')),
    __param(6, (0, common_1.Req)()),
    __param(7, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Number, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addProductwithFile", null);
__decorate([
    (0, common_1.Post)('/updateProduct'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: filesconfig_multer_1.destination,
            filename: filesconfig_multer_1.editFileName,
        }),
        fileFilter: filesconfig_multer_1.imageFileFilter,
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('ProductName')),
    __param(2, (0, common_1.Body)('description')),
    __param(3, (0, common_1.Body)('price')),
    __param(4, (0, common_1.Body)('quantity')),
    __param(5, (0, common_1.Body)('catagory')),
    __param(6, (0, common_1.Body)('Id')),
    __param(7, (0, common_1.Req)()),
    __param(8, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Number, String, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Post)('/newproduct'),
    __param(0, (0, common_1.Body)('ProductName')),
    __param(1, (0, common_1.Body)('description')),
    __param(2, (0, common_1.Body)('price')),
    __param(3, (0, common_1.Body)('quantity')),
    __param(4, (0, common_1.Body)('catagory')),
    __param(5, (0, common_1.Body)('file')),
    __param(6, (0, common_1.Req)()),
    __param(7, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "newProductWithImg", null);
__decorate([
    (0, common_1.Put)('/updateproduct/:Id'),
    __param(0, (0, common_1.Body)('ProductName')),
    __param(1, (0, common_1.Body)('description')),
    __param(2, (0, common_1.Body)('price')),
    __param(3, (0, common_1.Body)('quantity')),
    __param(4, (0, common_1.Body)('catagory')),
    __param(5, (0, common_1.Body)('file')),
    __param(6, (0, common_1.Param)('Id')),
    __param(7, (0, common_1.Req)()),
    __param(8, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, String, String, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateProductWithimg", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'delete product data ' }),
    (0, common_1.Delete)('/deleteProduct/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Get)('allProducts'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAllProducts", null);
__decorate([
    (0, common_1.Get)('listProduct'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "AllProducts", null);
__decorate([
    (0, common_1.Get)('categoryWise/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductByCategoryId", null);
__decorate([
    (0, common_1.Get)('getProductById/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Get)('/updateQuantity'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateQuantity", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "searchData", null);
ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Product Module'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        category_service_1.CategoryService,
        jwt_1.JwtService])
], ProductsController);
exports.ProductsController = ProductsController;
//# sourceMappingURL=products.controller.js.map