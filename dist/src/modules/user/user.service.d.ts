import { CreateUserDto } from './dto/create-user.dto';
export declare class UserService {
    create(createUserDto: CreateUserDto, rolesId: number): Promise<any>;
    findAll(page: number, pageSize: number): Promise<any>;
    update(id: number, updatedata: any): Promise<{
        statusCode: number;
        email: string;
    }>;
    remove(id: number): Promise<{
        statusCode: number;
        msg: string;
    } | {
        statusCode: number;
        msg?: undefined;
    }>;
    searchCategories(query: string, page: number, pageSize: number): Promise<any>;
    usersDataListing(req: any): Promise<{
        user: import(".prisma/client").User[];
        count: import(".prisma/client").User[];
    }>;
}
