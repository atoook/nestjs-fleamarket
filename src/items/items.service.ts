import { Injectable, NotFoundException } from '@nestjs/common';
import { Item, ItemStatus } from 'generated/prisma';
import { CreateItemDto } from './dto/create-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll(): Promise<Item[]> {
    return await this.prismaService.item.findMany();
  }
  async findById(id: string): Promise<Item> {
    const found = await this.prismaService.item.findUnique({
      where: { id },
    });
    if (!found) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return found;
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const { name, price, description } = createItemDto;
    return this.prismaService.item.create({
      data: {
        name,
        price,
        description,
        status: ItemStatus.ON_SALE,
      },
    });
  }

  async updateStatus(id: string): Promise<Item> {
    const item = await this.findById(id);
    return await this.prismaService.item.update({
      where: { id },
      data: {
        status: ItemStatus.SOLD_OUT,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.item.delete({
      where: { id },
    });
  }
}
