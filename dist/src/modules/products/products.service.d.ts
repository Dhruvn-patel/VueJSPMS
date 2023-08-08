/// <reference types="multer" />
import { ProductCategory } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { productDto } from './dto/product.dto';
export declare class ProductsService {
    private prismService;
    constructor(prismService: PrismaService);
    addProduct(product: productDto, categoryId: number, userId: number): Promise<any>;
    updateProduct(product: productDto, id: number, catgoryId: number): Promise<any>;
    deleteProduct(id: number): Promise<any>;
    uploadSingleFile(file: Express.Multer.File, ProductName: string, description: string, price: number, quantity: number, categoryIds: string): Promise<import(".prisma/client").Product & {
        ProductCategory: ProductCategory[];
    }>;
    addProductWithImg(file: string, ProductName: string, description: string, price: number, quantity: number, categoryIds: string): Promise<any>;
    productUpdateById(file: Express.Multer.File, ProductName: string, description: string, price: number, quantity: number, categoryIds: string, productId: number): Promise<import(".prisma/client").Product & {
        ProductCategory: ProductCategory[];
    }>;
    updateProductById(file: string, ProductName: string, description: string, price: number, quantity: number, categoryIds: string, productId: number): Promise<import(".prisma/client").Product & {
        ProductCategory: ProductCategory[];
    }>;
    imageById(productId: number): Promise<{
        image: string;
    }>;
    deleteCategory(id: number): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getAllProductsWithCategory(): Promise<any>;
    getAllProductsWithCategoryById(id: number): Promise<any>;
    findAllProducts(page: number, pageSize: number): Promise<{
        totalData: number;
        productsWithCategory: {
            id: number;
            ProductName: string;
            description: string;
            image: string;
            price: number;
            quantity: number;
            categoryNames: {
                name: string;
                id: number;
            }[];
        }[];
    }>;
    AllProducts(sortType: any): Promise<{
        productsWithCategory: {
            id: number;
            ProductName: string;
            description: string;
            image: string;
            price: number;
            quantity: number;
            categoryNames: string[];
        }[];
    }>;
    searchProducts(query: string, page: number, pageSize: number): Promise<{
        products: {
            id: number;
            ProductName: string;
            description: string;
            image: string;
            price: number;
            quantity: number;
            categoryNames: string[];
        }[];
        totalData: number;
    }>;
    allDataSearch(query: any, sortType: any, id: number, priceStart: number, priceStop: number): Promise<{
        products: {
            id: number;
            ProductName: string;
            description: string;
            image: string;
            price: number;
            quantity: number;
            categoryNames: string[];
        }[];
    }>;
    updateQuantity(id: number, quantity: number): Promise<any>;
    categorywiseProduct(id: number): Promise<{
        id: number;
        ProductName: string;
        description: string;
        image: string;
        price: number;
        quantity: number;
        categoryNames: string[];
    }[]>;
}
