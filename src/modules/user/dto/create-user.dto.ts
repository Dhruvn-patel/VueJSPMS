/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsEmpty,
  isEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  isString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  name: string;

  rolesId: number;
}
