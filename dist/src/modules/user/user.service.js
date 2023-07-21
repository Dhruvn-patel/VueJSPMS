"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let UserService = class UserService {
    async create(createUserDto, rolesId) {
        try {
            const hashpassword = await bcrypt.hash(createUserDto.password, 10);
            const emailExists = await prisma.user.findUnique({
                where: { email: createUserDto.email },
            });
            console.log('createUserDto.rolesId', createUserDto.rolesId);
            if (emailExists)
                return {
                    errorCode: 409,
                };
            const data = await prisma.user.create({
                data: {
                    email: createUserDto.email,
                    name: createUserDto.name,
                    rolesId: Number(rolesId),
                    password: hashpassword,
                },
            });
            return data;
        }
        catch (error) {
            return error;
        }
    }
    async findAll() {
        try {
            const totaldata = await prisma.user.count({});
            const data = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    rolesId: true,
                    googleId: false,
                },
            });
            return {
                data,
                totaldata,
            };
        }
        catch (error) {
            return error;
        }
    }
    async update(id, updatedata) {
        const { name, email } = updatedata;
        console.log(name, email);
        const getemaidata = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
        });
        const data = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                name: name,
                email: email,
            },
        });
        return {
            statusCode: 200,
            email: getemaidata.email,
        };
    }
    async remove(id) {
        const checkadmin = await prisma.user.findFirst({
            where: { id: Number(id) },
            select: {
                rolesId: true,
            },
        });
        const countAdmin = await prisma.user.count({
            where: { rolesId: 1 },
        });
        if (checkadmin.rolesId == 1) {
            if (countAdmin <= 1) {
                return {
                    statusCode: 403,
                    msg: 'not possible to remove admin',
                };
            }
            const deleteData = await prisma.user.delete({
                where: { id: Number(id) },
            });
            return {
                statusCode: 200,
            };
        }
        else {
            const deleteData = await prisma.user.delete({
                where: { id: Number(id) },
            });
            return {
                statusCode: 200,
            };
        }
    }
    async searchCategories(query, page, pageSize) {
        try {
            const skip = (page - 1) * pageSize;
            const take = pageSize;
            const totalData = await prisma.user.count({
                where: {
                    OR: [
                        {
                            name: {
                                startsWith: query,
                            },
                        },
                        {
                            email: {
                                startsWith: query,
                            },
                        },
                    ],
                },
            });
            const categories = await prisma.user.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                startsWith: query,
                            },
                        },
                        {
                            email: {
                                startsWith: query,
                            },
                        },
                    ],
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
                skip,
                take,
            });
            console.log('totaldata', totalData);
            console.log('categories', categories);
            return {
                categories,
                totalData,
            };
        }
        catch (error) {
            return error;
        }
    }
    async usersDataListing(req) {
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
        console.log(columnName);
        let data;
        if (isNaN(search.value)) {
            data = {
                OR: [
                    {
                        name: {
                            contains: search.value,
                        },
                    },
                    {
                        email: {
                            contains: search.value,
                        },
                    },
                ],
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
                        email: {
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
        let user = await prisma.user.findMany({
            where: data,
            skip: Number(start),
            take: Number(length),
            orderBy: [{ [`${columnName}`]: dir }],
        });
        let count = await prisma.user.findMany({
            where: data,
        });
        console.log('user', user);
        console.log('count', count);
        return { user, count };
    }
};
UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map