import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    cartegoryData(): void;
    findAllCategory(req: any, res: any): Promise<any>;
    findCategory(req: any, res: any): Promise<any>;
    addCategory(categoryRes: CreateCategoryDto, req: any, res: any): Promise<any>;
    updatecategory(updateRes: CreateCategoryDto, id: number, req: any, res: any): Promise<any>;
    deleteCategory(id: number, req: any, res: any): Promise<any>;
    search(params: any, req: any, res: any): Promise<any>;
    fetchCategory(req: any, res: any): Promise<void>;
}
