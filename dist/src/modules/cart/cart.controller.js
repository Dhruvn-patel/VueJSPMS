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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
const jwt_1 = require("@nestjs/jwt");
const jwt_guard_1 = require("../../guards/jwt.guard");
let CartController = class CartController {
    constructor(cartService, jwtService) {
        this.cartService = cartService;
        this.jwtService = jwtService;
    }
    async displayOrder(req, res) {
        const { token } = req.cookies['JWT_TOKEN'];
        const dataget = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET_USER,
        });
        const { email, name, userId } = dataget;
        const result = await this.cartService.allOrderProduct(userId);
        const products = result.findProduct;
        return res.render('order', {
            products,
            totalprice: result.price,
            quantity: result.quantity,
        });
    }
    async displayCart(req, res) {
        const token = req.headers.authorization.split(' ')[1];
        const dataget = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET_USER,
        });
        const { email, name, userId } = dataget;
        const result = await this.cartService.getCartItems(Number(userId), 'cart');
        const products = result.findProductDetails;
        const QuantityCart = result.QuantityArr;
        let i = 0;
        products.map((product) => {
            product.quantity = QuantityCart[i];
            i++;
        });
        return res.render('cart', { products });
    }
    async displayOrderHistory(req, res) {
        const token = req.headers.authorization.split(' ')[1];
        const dataget = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET_USER,
        });
        const { email, name, userId } = dataget;
        const historydata = await this.cartService.allhistoryData(userId);
        let data = historydata.listOderedProducts;
        const productdeatils = historydata.listOdered;
        return res.status(200).json({
            data,
            productdeatils,
        });
    }
    async getQuantityById(params, req, res) {
        const { token } = req.cookies['JWT_TOKEN'];
        const dataget = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET_USER,
        });
        const { email, name, userId } = dataget;
        const { id } = params;
    }
    async getAddInCart(req, res, data) {
        const userId = data.userId;
        const result = await this.cartService.addIntoCart(userId, data.dataCart, data.type);
        console.log('result', result);
        return res.json({
            result,
        });
    }
    async updateQuantity(params, req, res) {
        const { productId, quantity } = params;
        const { token } = req.cookies['JWT_TOKEN'];
        const dataget = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET_USER,
        });
        const { email, name, userId } = dataget;
    }
    async getCartData(req, res) {
        const result = await this.cartService.getCartItems(4, 'cart');
        const products = result.findProductDetails;
        const Quantity = result.Quantity;
        if (result.findProductDetails.length) {
            return res.status(200).json({
                status: common_1.HttpStatus.OK,
                data: { products, Quantity },
                message: `List of Products`,
            });
        }
    }
    async deleteSoft(req, res) {
        const { token } = req.cookies['JWT_TOKEN'];
        const dataget = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET_USER,
        });
        const { email, name, userId } = dataget;
        const result = await this.cartService.deleteSoftValues(userId);
        return res.json({ result });
    }
    async getDeleteItemsInCart(params, req, res) {
        const { token } = req.cookies['JWT_TOKEN'];
        const dataget = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET_USER,
        });
        const { email, name, userId } = dataget;
        const result = await this.cartService.DeleteItemsInCart(userId, params.id);
        return res.status(200).json({
            status: 200,
            data: result,
            message: `Product Deleted !`,
        });
    }
    async addOrder(req, res, data) {
        console.log('data', data);
        const result = await this.cartService.orderAdd(data.userId);
        if (result.status == 400) {
            return res.status(400).json({
                status: 400,
                data: result,
                message: `Something went false !`,
            });
        }
        else if (result.status == 409) {
            return res.status(409).json({
                status: 409,
                data: result,
                message: `Product is already Ordered !`,
            });
        }
        else {
            return res.status(200).json({
                status: 200,
                data: result,
                message: `Product Ordered !`,
            });
        }
    }
    async getRestoreCartData(req, res) {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(' ')[1];
        const dataget = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET_USER,
        });
        const { email, name, userId } = dataget;
        console.log(userId);
        const result = await this.cartService.getCartData(userId);
        return res.status(200).json({
            status: 200,
            data: result,
            message: `Cart All !`,
        });
    }
    async getAllOrder(req, res, data) {
        const { token } = req.cookies['JWT_TOKEN'];
        const dataget = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET_USER,
        });
        const { email, name, userId } = dataget;
        const result = await this.cartService.allOrderProduct(userId);
        return res.status(200).json({
            status: 200,
            data: result,
            message: `Product All !`,
        });
    }
    async updateOrders(req, res) {
        const { token } = req.cookies['JWT_TOKEN'];
        const dataget = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET_USER,
        });
        const { email, name, userId } = dataget;
        const result = await this.cartService.updateOrder(userId);
        return res.status(200).json({
            status: 200,
            data: result,
            message: `order update  !`,
        });
    }
    async lastData(req, res) {
        const data = await this.cartService.orderDisplay();
        return res.json(data);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard),
    (0, common_1.Get)('order'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "displayOrder", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.AuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "displayCart", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "displayOrderHistory", null);
__decorate([
    (0, common_1.Get)('/updateQuantity/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getQuantityById", null);
__decorate([
    (0, common_1.Post)('addIntoCart'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getAddInCart", null);
__decorate([
    (0, common_1.Get)('/updateQuantity'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateQuantity", null);
__decorate([
    (0, common_1.Get)('getData'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCartData", null);
__decorate([
    (0, common_1.Get)('deletesoft'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "deleteSoft", null);
__decorate([
    (0, common_1.Delete)('deleteData/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getDeleteItemsInCart", null);
__decorate([
    (0, common_1.Post)('OrderAdd'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addOrder", null);
__decorate([
    (0, common_1.Get)('getCartData'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getRestoreCartData", null);
__decorate([
    (0, common_1.Get)('getAllOrders'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getAllOrder", null);
__decorate([
    (0, common_1.Get)('orderUpdate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateOrders", null);
__decorate([
    (0, common_1.Get)('/lastInsert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "lastData", null);
CartController = __decorate([
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService,
        jwt_1.JwtService])
], CartController);
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map