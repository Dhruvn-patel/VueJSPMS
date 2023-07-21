import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoryService {
    private prismService;
    constructor(prismService: PrismaService);
    addCategory(categoryRes: CreateCategoryDto): Promise<any>;
    getAllCategories(): Promise<any>;
    getAllCategory(): Promise<{
        data: {
            name: string;
            id: number;
        }[];
        totaldata: number;
    }>;
    updateData(updateRes: CreateCategoryDto, id: number): Promise<any>;
    deleteData(id: number): Promise<any>;
    findAllCategoriesPaginated(page: number, pageSize: number): Promise<any>;
    findAllSortedCategories(sortBy: string, sortOrder: 'ASC' | 'DESC'): Promise<any>;
    searchCategories(query: string, page: number, pageSize: number): Promise<any>;
    categoryListing(req: any): Promise<{
        user: import(".prisma/client").Categories[];
        count: import(".prisma/client").Categories[];
    }>;
}
