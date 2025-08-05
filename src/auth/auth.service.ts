import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, status } = createUserDto;
    return this.prismaService.user.create({
      data: {
        name,
        email,
        password,
        status,
      },
    });
  }
}
