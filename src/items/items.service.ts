import { Injectable, NotFoundException } from '@nestjs/common';
import { Item, ItemStatus } from 'generated/prisma';
import { CreateItemDto } from './dto/create-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private readonly prismaService: PrismaService) {}
  private items: Item[] = [];
  findAll(): Item[] {
    return this.items;
  }
  findById(id: string): Item | undefined {
    const found = this.items.find((item) => item.id === id);
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

  updateStatus(id: string): Item | undefined {
    const item = this.findById(id);
    if (item) {
      item.status = 'SOLD_OUT';
    }
    return item;
  }

  delete(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }
}
