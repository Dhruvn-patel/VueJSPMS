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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const prisma = new client_1.PrismaClient();
let ProductsService = class ProductsService {
    constructor(prismService) {
        this.prismService = prismService;
    }
    async addProduct(product, categoryId) {
        const { ProductName, description, price, image, quantity } = product;
        try {
            const productdata = await this.prismService.product.create({
                data: {
                    ProductName: ProductName,
                    description: description,
                    price: price,
                    image: image,
                    quantity: 1,
                    ProductCategory: {
                        create: {
                            Categories: {
                                connect: {},
                            },
                        },
                    },
                },
                include: { ProductCategory: true },
            });
            return productdata;
        }
        catch (error) {
            return error;
        }
    }
    async updateProduct(product, id, catgoryId) {
        const { ProductName, description, price, image } = product;
        const updateProduct = await prisma.product.update({
            where: { id: id },
            data: {
                ProductName: ProductName,
                description: description,
                price: price,
                image: image,
                ProductCategory: {},
            },
        });
    }
    async deleteProduct(id) {
        try {
            const isExitData = await this.prismService.productCategory.findFirst({
                where: { productId: id },
            });
            if (isExitData) {
                const deleteDataOnJunction = await this.prismService.productCategory.deleteMany({
                    where: {
                        productId: id,
                    },
                });
            }
            const deleteData = await this.prismService.product.delete({
                where: {
                    id,
                },
            });
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async uploadSingleFile(file, ProductName, description, price, quantity, categoryIds) {
        const categoryIdArray = categoryIds
            .split(',')
            .map((id) => Number(id.trim()))
            .filter((categoryId) => !isNaN(categoryId));
        const categories = categoryIdArray.map((categoryId) => ({
            id: Number(categoryId),
        }));
        try {
            const data = await this.prismService.product.create({
                data: {
                    ProductName: ProductName,
                    description,
                    price: Number(price),
                    quantity: Number(quantity),
                    image: file.filename,
                    ProductCategory: {
                        create: categories.map((category) => ({
                            Categories: {
                                connect: category,
                            },
                        })),
                    },
                },
                include: { ProductCategory: true },
            });
            return data;
        }
        catch (error) {
            console.log(error.message);
        }
    }
    async productUpdateById(file, ProductName, description, price, quantity, categoryIds, productId) {
        const categoryIdArray = categoryIds
            .split(',')
            .map((id) => Number(id.trim()))
            .filter((categoryId) => !isNaN(categoryId));
        const categories = categoryIdArray.map((categoryId) => ({
            id: Number(categoryId),
        }));
        console.log(file);
        const isExists = await this.deleteCategory(productId);
        console.log(categories);
        try {
            if (file == undefined) {
                const data = await this.prismService.product.update({
                    data: {
                        ProductName: ProductName,
                        description,
                        price: Number(price),
                        quantity: Number(quantity),
                        ProductCategory: {
                            create: categories.map((category) => ({
                                Categories: {
                                    connect: category,
                                },
                            })),
                        },
                    },
                    where: { id: Number(productId) },
                    include: { ProductCategory: true },
                });
                return data;
            }
            const data = await this.prismService.product.update({
                data: {
                    ProductName: ProductName,
                    description,
                    price: Number(price),
                    quantity: Number(quantity),
                    image: file.filename,
                    ProductCategory: {
                        create: categories.map((category) => ({
                            Categories: {
                                connect: category,
                            },
                        })),
                    },
                },
                where: { id: Number(productId) },
                include: { ProductCategory: true },
            });
            return data;
        }
        catch (error) {
            console.log(error.message);
        }
    }
    async imageById(productId) {
        return await this.prismService.product.findFirst({
            where: { id: Number(productId) },
            select: {
                image: true,
            },
        });
    }
    async deleteCategory(id) {
        return await this.prismService.productCategory.deleteMany({
            where: {
                productId: Number(id),
            },
        });
    }
    async getAllProductsWithCategory() {
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
                    price: product.price,
                    quantity: product.quantity,
                    categoryNames: categoryNames,
                };
            });
            return productsWithCategory;
        }
        catch (error) {
            throw new Error('Failed to fetch product data');
        }
    }
    async getAllProductsWithCategoryById(id) {
        console.log(id);
        try {
            const product = await this.prismService.product.findUnique({
                where: {
                    id: id,
                },
            });
            console.log(product);
            return {
                id: product.id,
                ProductName: product.ProductName,
                description: product.description,
                image: product.image,
                price: product.price,
                quantity: product.quantity,
            };
        }
        catch (error) {
            throw new Error('Failed to fetch product data');
        }
    }
    async findAllProducts(page, pageSize) {
        const skip = (Number(page) - 1) * Number(pageSize);
        const take = pageSize;
        const totalData = await this.prismService.product.count({});
        try {
            const productsData = await this.prismService.product.findMany({
                include: {
                    ProductCategory: {
                        include: {
                            Categories: true,
                        },
                    },
                },
                skip,
                take,
            });
            const productsWithCategory = productsData.map((product) => {
                const categoryNames = product.ProductCategory.map((productCategory) => productCategory.Categories.name);
                return {
                    id: product.id,
                    ProductName: product.ProductName,
                    description: product.description,
                    image: product.image,
                    price: product.price,
                    quantity: product.quantity,
                    categoryNames: categoryNames,
                };
            });
            return { totalData, productsWithCategory };
        }
        catch (error) {
            throw new Error('Failed to fetch product data');
        }
    }
    async AllProducts(sortType) {
        try {
            const productsData = await this.prismService.product.findMany({
                orderBy: {
                    price: sortType,
                },
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
                    price: product.price,
                    quantity: product.quantity,
                    categoryNames: categoryNames,
                };
            });
            return { productsWithCategory };
        }
        catch (error) {
            throw new Error('Failed to fetch product data');
        }
    }
    async searchProducts(query, page, pageSize) {
        try {
            const skip = (page - 1) * pageSize;
            const take = pageSize;
            const productsData = await this.prismService.product.findMany({
                where: {
                    OR: [
                        {
                            ProductName: {
                                startsWith: query,
                            },
                        },
                        {
                            description: {
                                startsWith: query,
                            },
                        },
                    ],
                },
                orderBy: {
                    price: 'asc',
                },
                include: {
                    ProductCategory: {
                        include: {
                            Categories: true,
                        },
                    },
                },
                skip,
                take,
            });
            const productsWithCategory = productsData.map((product) => {
                const categoryNames = product.ProductCategory.map((productCategory) => productCategory.Categories.name);
                return {
                    id: product.id,
                    ProductName: product.ProductName,
                    description: product.description,
                    image: product.image,
                    price: product.price,
                    quantity: product.quantity,
                    categoryNames: categoryNames,
                };
            });
            return {
                products: productsWithCategory,
                totalData: 10,
            };
        }
        catch (error) {
            console.error('Error occurred while searching products:', error);
            throw new Error('Failed to search products');
        }
    }
    async allDataSearch(query, sortType, id) {
        let productIds;
        if (!isNaN(id)) {
            productIds = await prisma.productCategory.findMany({
                where: {
                    categoriesId: Number(id),
                },
                select: {
                    productId: true,
                },
            });
        }
        else {
            productIds = [];
        }
        let data;
        if (query && id > 0) {
            data = {
                OR: [
                    {
                        ProductName: {
                            startsWith: query,
                        },
                    },
                    {
                        description: {
                            startsWith: query,
                        },
                    },
                ],
                id: {
                    in: productIds.map((product) => product.productId),
                },
            };
        }
        else if (!query && id > 0) {
            data = {
                id: {
                    in: productIds.map((product) => product.productId),
                },
            };
        }
        else if (query) {
            data = {
                OR: [
                    {
                        ProductName: {
                            startsWith: query,
                        },
                    },
                    {
                        description: {
                            startsWith: query,
                        },
                    },
                ],
            };
        }
        else {
            data: {
            }
        }
        try {
            const productsData = await this.prismService.product.findMany({
                where: data,
                orderBy: {
                    price: sortType,
                },
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
                    price: product.price,
                    quantity: product.quantity,
                    categoryNames: categoryNames,
                };
            });
            return {
                products: productsWithCategory,
            };
        }
        catch (error) {
            console.error('Error occurred while searching products:', error);
            throw new Error('Failed to search products');
        }
    }
    async updateQuantity(id, quantity) {
        const data = await this.prismService.product.update({
            where: { id: Number(id) },
            data: {
                quantity: Number(quantity),
            },
        });
    }
    async categorywiseProduct(id) {
        if (id) {
            const productIds = await prisma.productCategory.findMany({
                where: {
                    categoriesId: Number(id),
                },
                select: {
                    productId: true,
                },
            });
            const productDetails = await prisma.product.findMany({
                where: {
                    id: {
                        in: productIds.map((product) => product.productId),
                    },
                },
                include: {
                    ProductCategory: {
                        include: {
                            Categories: true,
                        },
                    },
                },
            });
            const productsWithCategory = productDetails.map((product) => {
                const categoryNames = product.ProductCategory.map((productCategory) => productCategory.Categories.name);
                return {
                    id: product.id,
                    ProductName: product.ProductName,
                    description: product.description,
                    image: product.image,
                    price: product.price,
                    quantity: product.quantity,
                    categoryNames: categoryNames,
                };
            });
            return productsWithCategory;
        }
        else {
            const productDetails = await prisma.product.findMany({
                include: {
                    ProductCategory: {
                        include: {
                            Categories: true,
                        },
                    },
                },
            });
            const productsWithCategory = productDetails.map((product) => {
                const categoryNames = product.ProductCategory.map((productCategory) => productCategory.Categories.name);
                return {
                    id: product.id,
                    ProductName: product.ProductName,
                    description: product.description,
                    image: product.image,
                    price: product.price,
                    quantity: product.quantity,
                    categoryNames: categoryNames,
                };
            });
            return productsWithCategory;
        }
    }
};
ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
exports.ProductsService = ProductsService;
//# sourceMappingURL=products.service.js.map