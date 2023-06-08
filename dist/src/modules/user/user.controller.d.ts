import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
export declare class UserController {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    create(createUserDto: CreateUserDto, req: any, res: any): Promise<any>;
    AllUsers(): void;
    findAll(params: any, req: any, res: any): Promise<any>;
    searchUsers(params: any, req: any, res: any): Promise<any>;
    update(id: number, updatedata: any, req: any, res: any): Promise<any>;
    remove(id: number, req: any, res: any): Promise<any>;
    datatableUser(req: any, res: any): Promise<void>;
}
