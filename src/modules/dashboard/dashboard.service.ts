import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class DashboardService {
  constructor(private prismService: PrismaService) {}

  async deleteUser(userId: number) {
    const userfind = await this.prismService.user.findUnique({
      where: { id: userId },
    });

    if (!userfind) throw new NotFoundException('user not found');

    return this.prismService.user.delete({
      where: { id: userId },
    });
  }

  async updateUser(user: UserDto, userId: any, req: Request, res: Response) {
    const { name, email, password } = user;
    try {
      return await this.prismService.user.update({
        where: { id: userId },
        data: {
          name,
          email,
          password,
        },
      });
    } catch (error) {
      console.log(error.message);
      return error;
    }
  }
}
