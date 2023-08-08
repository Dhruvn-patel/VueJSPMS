import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaClient, Roles } from '@prisma/client';


const prisma = new PrismaClient();
@Injectable()
export class RolesService {
  async create(createRoleDto: CreateRoleDto): Promise<Roles | null> {
    const { rolename } = createRoleDto;
    try {
      const isAlreadyExits = await prisma.roles.findFirst({
        where: {
          rolename,
        },
      });

      if (isAlreadyExits) {
        throw Error('already exists');
      }
      return await prisma.roles.create({
        data: {
          rolename,
        },
      });
    } catch (error) {
      return error;
    }
  }

 async findAll() {
  try {
   return await prisma.roles.findMany({})
  } catch (error) {
    return error
  }
    
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<Roles | null> {
    const { rolename } = updateRoleDto;
    try {
      return await prisma.roles.update({  
        where: {
          id: id,
        },
        data: {
          rolename,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async remove(id: number): Promise<Roles | null> {
    try {
      await prisma.roles.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      return error;
    }
  }
}
