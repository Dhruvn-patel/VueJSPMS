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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const prisma = new client_1.PrismaClient();
let CartService = class CartService {
    constructor(prismService) {
        this.prismService = prismService;
    }
    async AddItemsCart(userId, productId) {
        try {
            const checkIfExists = await prisma.cart.findFirst({
                where: {
                    userId: Number(userId),
                    productId: Number(productId),
                },
            });
            if (checkIfExists) {
                return {
                    errmsg: 'Product already added ! ',
                    status: 403,
                };
            }
            const findProduct = await prisma.product.findUnique({
                where: {
                    id: Number(productId),
                },
                select: {
                    quantity: true,
                    price: true,
                },
            });
            const Quantity = findProduct.quantity;
            const CreateCart = await prisma.cart.create({
                data: {
                    userId: userId,
                    Quantity: Number(Quantity),
                    productId: Number(productId),
                    total: findProduct.price,
                },
            });
            return CreateCart;
        }
        catch (error) {
            return error;
        }
    }
    async addIntoCart(userId, data, type) {
        let cartData = [];
        if (type) {
            data.map((cart) => {
                cartData.push({
                    userId: userId,
                    Quantity: cart.quantity,
                    productId: Number(cart.id),
                    total: Number(cart.price * cart.quantity),
                    deleted: true,
                });
            });
        }
        else {
            data.map((cart) => {
                cartData.push({
                    userId: userId,
                    Quantity: cart.quantity,
                    productId: Number(cart.id),
                    total: Number(cart.price * cart.quantity),
                });
            });
        }
        try {
            const CreateCart = await prisma.cart.createMany({
                data: cartData,
            });
            return CreateCart;
        }
        catch (error) {
            return error;
        }
    }
    async getCartData(userId) {
        const findProductFromCart = await prisma.cart.findMany({
            where: {
                userId: Number(userId),
                deleted: false,
            },
            select: {
                productId: true,
            },
        });
        try {
            const productsData = await this.prismService.product.findMany({
                include: {
                    ProductCategory: {
                        include: {
                            Categories: true,
                        },
                    },
                },
            });
            const productsWithCategory = productsData.map((product) => {
                const categoryNames = product.ProductCategory.map((productCategory) => productCategory.Categories.name);
                return {
                    id: product.id,
                    ProductName: product.ProductName,
                    description: product.description,
                    image: product.image,
                    totalPrice: product.quantity * product.price,
                    price: product.price,
                    quantity: product.quantity,
                    categoryNames: categoryNames,
                };
            });
            const listCartData = [];
            let totalRestoreCart = 0;
            for (let i = 0; i < findProductFromCart.length; i++) {
                for (let j = 0; j < productsWithCategory.length; j++) {
                    if (findProductFromCart[i].productId === productsWithCategory[j].id) {
                        listCartData.push(productsWithCategory[j]);
                        totalRestoreCart += productsWithCategory[j].totalPrice;
                    }
                }
            }
            return { listCartData, totalRestoreCart };
        }
        catch (error) {
            throw new Error('Failed to fetch product data');
        }
    }
    async getCartItems(UserID, type) {
        try {
            let getUserCartItems;
            if (type == 'cart') {
                getUserCartItems = await prisma.cart.findMany({
                    where: {
                        userId: UserID,
                        deleted: false,
                    },
                });
            }
            else {
                getUserCartItems = await prisma.cart.findMany({
                    where: {
                        userId: UserID,
                        deleted: true,
                    },
                });
            }
            const ProductArr = [];
            const QuantityArr = [];
            for (let i = 0; i < getUserCartItems.length; i++) {
                ProductArr.push(getUserCartItems[i].productId);
                QuantityArr.push(getUserCartItems[i].Quantity);
            }
            if (getUserCartItems) {
                const findProductDetails = await prisma.product.findMany({
                    where: {
                        id: {
                            in: ProductArr,
                        },
                    },
                });
                return { findProductDetails, QuantityArr };
            }
        }
        catch (error) {
            return new common_1.BadRequestException();
        }
    }
    async DeleteItemsInCart(UserID, ProductId) {
        try {
            const findProductFromCart = await prisma.cart.findMany({
                where: {
                    productId: Number(ProductId),
                    userId: Number(UserID),
                },
            });
            if (findProductFromCart) {
                const DeleteProducTFromCart = await prisma.cart.delete({
                    where: {
                        id: findProductFromCart[0].id,
                    },
                });
                return DeleteProducTFromCart;
            }
            else {
                return new common_1.BadRequestException();
            }
        }
        catch (error) {
            return new common_1.ForbiddenException();
        }
    }
    async deleteSoftValues(UserID) {
        const data = await prisma.cart.updateMany({
            where: {
                userId: Number(UserID),
            },
            data: {
                deleted: true,
            },
        });
        return data;
    }
    async OrderProduct(UserID) {
        try {
            const findProductFromCart = await prisma.cart.findMany({
                where: {
                    userId: Number(UserID),
                },
            });
            const objectData = findProductFromCart;
            var totalAmount = 0;
            var totalQuantity = 0;
            const ProductArr = [];
            objectData.map((product) => {
                ProductArr.push({
                    productId: product.productId,
                    userId: Number(UserID),
                    quantity: Number(product.Quantity),
                });
                totalAmount += Number(product.total) * Number(product.Quantity);
                totalQuantity += Number(product.Quantity);
            });
            const placeOrder = await prisma.order.create({
                data: {
                    totalPrice: Number(totalAmount),
                    userId: Number(UserID),
                    OrderProduct: {
                        createMany: {
                            data: ProductArr,
                        },
                    },
                },
            });
            return placeOrder;
        }
        catch (error) {
            console.log(error);
            return new common_1.ForbiddenException();
        }
    }
    async orderAdd(userId) {
        try {
            const findProductFromCart = await prisma.cart.findMany({
                where: {
                    userId: Number(userId),
                    deleted: true,
                },
            });
            const objectData = findProductFromCart;
            var totalAmount = 0;
            var totalQuantity = 0;
            const ProductArr = [];
            objectData.map((product) => {
                ProductArr.push({
                    productId: product.productId,
                    userId: Number(userId),
                    quantity: Number(product.Quantity),
                });
                totalAmount += Number(product.total) * Number(product.Quantity);
                totalQuantity += Number(product.Quantity);
            });
            const placeOrder = await prisma.order.create({
                data: {
                    totalPrice: Number(totalAmount),
                    userId: Number(userId),
                    OrderProduct: {
                        createMany: {
                            data: ProductArr,
                        },
                    },
                },
            });
            return placeOrder;
        }
        catch (error) {
            console.log(error);
        }
    }
    async deleteCartData(UserID) {
        try {
            await prisma.cart.deleteMany({
                where: {
                    userId: Number(UserID),
                },
            });
        }
        catch (error) { }
    }
    async allOrderProduct(UserID) {
        const listOderedProducts = await prisma.order.findMany({
            where: {
                userId: Number(UserID),
                isOrdered: false,
            },
            include: {
                OrderProduct: true,
            },
        });
        const ProductArr = [];
        const price = [];
        const quantity = [];
        for (let j = 0; j < listOderedProducts.length; j++) {
            for (let i = 0; i < listOderedProducts[j].OrderProduct.length; i++) {
                quantity.push(listOderedProducts[j].OrderProduct[i].quantity);
                ProductArr.push(listOderedProducts[j].OrderProduct[i].productId);
                price.push(listOderedProducts[j].totalPrice);
            }
        }
        const findProduct = await prisma.product.findMany({
            where: {
                id: {
                    in: ProductArr,
                },
            },
        });
        return { findProduct, price, quantity };
    }
    async allhistoryData(UserID) {
        const listOderedProducts = await prisma.order.findMany({
            where: {
                userId: Number(UserID),
            },
            include: {
                OrderProduct: true,
            },
        });
        const orderIds = [];
        for (let i = 0; i < listOderedProducts.length; i++) {
            orderIds.push(listOderedProducts[i].id);
        }
        const listOdered = await prisma.orderProduct.findMany({
            where: {
                orderId: { in: orderIds },
            },
            include: {
                Product: true,
            },
        });
        return { listOderedProducts, listOdered };
    }
    async updateOrder(UserID) {
        try {
            const data = await this.orderDisplay();
            const listOderedProducts = await prisma.order.updateMany({
                where: {
                    userId: UserID,
                },
                data: {
                    isOrdered: true,
                },
            });
        }
        catch (error) {
            return new common_1.ForbiddenException();
        }
    }
    async orderDisplay() {
        const data = await prisma.order.findMany({
            orderBy: {
                id: 'desc',
            },
            select: {
                id: true,
                totalPrice: true,
            },
        });
        return data[0];
    }
};
CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map