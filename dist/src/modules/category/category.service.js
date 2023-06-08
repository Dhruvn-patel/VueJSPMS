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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const prisma = new client_1.PrismaClient();
let CategoryService = class CategoryService {
    constructor(prismService) {
        this.prismService = prismService;
    }
    async addCategory(categoryRes) {
        const categoryname = categoryRes.name;
        try {
            const ischeckalready = await this.prismService.categories.findFirst({
                where: {
                    name: categoryname,
                },
            });
            if (ischeckalready) {
                return { ischeckalready, status: 403 };
            }
            const data = await this.prismService.categories.create({
                data: {
                    name: categoryname,
                },
            });
            return {
                data,
                status: 200,
            };
        }
        catch (error) {
            return error;
        }
    }
    async getAllCategories() {
        const data = await this.prismService.categories.findMany({
            select: {
                id: true,
                name: true,
            },
        });
        return data;
    }
    async getAllCategory(page, pageSize) {
        const totaldata = await this.prismService.categories.count({});
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const data = await this.prismService.categories.findMany({
            select: {
                id: true,
                name: true,
            },
            skip,
            take,
        });
        return {
            data,
            totaldata,
        };
    }
    async updateData(updateRes, id) {
        const { name } = updateRes;
        try {
            const ischeckalready = await this.prismService.categories.findFirst({
                where: {
                    name: name,
                },
            });
            if (ischeckalready) {
                return { ischeckalready, status: 403 };
            }
            const updateData = await prisma.categories.update({
                where: {
                    id: id,
                },
                data: {
                    name: name,
                },
            });
            return {
                updateData,
                status: 200,
            };
        }
        catch (error) {
            return error;
        }
    }
    async deleteData(id) {
        try {
            const isExitData = await this.prismService.productCategory.findFirst({
                where: { categoriesId: id },
            });
            if (isExitData) {
                const deleteDataOnJunction = await this.prismService.productCategory.deleteMany({
                    where: {
                        categoriesId: id,
                    },
                });
            }
            const deleteData = await this.prismService.categories.delete({
                where: {
                    id: id,
                },
            });
            return deleteData;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async findAllCategoriesPaginated(page, pageSize) {
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const categories = await this.prismService.categories.findMany({
            skip,
            take,
        });
        return categories;
    }
    async findAllSortedCategories(sortBy, sortOrder) {
        const validColumns = ['id', 'name'];
        if (!validColumns.includes(sortBy)) {
            throw new Error(`Invalid column for sorting. Valid columns: ${validColumns.join(', ')}`);
        }
        const categories = await this.prismService.categories.findMany({
            orderBy: {
                [sortBy]: sortOrder,
            },
        });
        return categories;
    }
    async searchCategories(query, page, pageSize) {
        try {
            const skip = (page - 1) * pageSize;
            const take = pageSize;
            const totalData = await this.prismService.categories.count({
                where: {
                    name: {
                        startsWith: query,
                    },
                },
            });
            const categories = await this.prismService.categories.findMany({
                where: {
                    name: {
                        startsWith: query,
                    },
                },
                select: {
                    id: true,
                    name: true,
                },
                skip,
                take,
            });
            return {
                categories,
                totalData,
            };
        }
        catch (error) {
            console.log(error.message);
        }
    }
    async categoryListing(req) {
        const { search, order, start, length } = req.query;
        const query = {
            where: {},
            skip: Number(start) || 0,
            take: Number(length) || 10,
            orderBy: [],
        };
        const { column, dir } = order[0];
        let columnName = req.query.columns[column].data;
        query.orderBy.push({ [`${columnName}`]: dir });
        console.log('columnName', columnName);
        let data;
        if (isNaN(search.value)) {
            data = {
                name: {
                    contains: search.value,
                },
                deletedAt: null,
            };
        }
        else {
            data = {
                OR: [
                    {
                        name: {
                            contains: search.value,
                        },
                    },
                    {
                        id: {
                            equals: Number(search.value),
                        },
                    },
                ],
                deletedAt: null,
            };
        }
        let user = await prisma.categories.findMany({
            where: data,
            skip: Number(start),
            take: Number(length),
            orderBy: [{ [`${columnName}`]: dir }],
        });
        let count = await prisma.categories.findMany({});
        return { user, count };
    }
};
CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map