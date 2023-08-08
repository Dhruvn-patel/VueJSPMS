import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRoleDto {
    
    @IsNotEmpty()
    rolename: string;


}   
