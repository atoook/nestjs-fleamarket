import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma/prisma.service';
import { Item, ItemStatus } from '../../generated/prisma';
import { NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';

// Mock PrismaService for testing
const mockPrismaService = {
  item: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ItemsServiceTest', () => {
  let itemsService: ItemsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    itemsService = module.get<ItemsService>(ItemsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('Normal', async () => {
      (prismaService.item.findMany as jest.Mock).mockResolvedValue([]);
      const expected = [];
      const result = await itemsService.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findUnique', () => {
    it('Normal', async () => {
      const item: Item = {
        id: 'test-id1',
        name: 'PC',
        price: 100000,
        description: '未使用品',
        status: 'ON_SALE',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        userId: 'test-user1',
      };
      (prismaService.item.findUnique as jest.Mock).mockResolvedValue(item);
      const result = await itemsService.findById('test-id1');
      expect(result).toEqual(item);
      expect(prismaService.item.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id1' },
      });
    });
    it('Error: ItemNotFound', async () => {
      (prismaService.item.findUnique as jest.Mock).mockResolvedValue(null);
      // Test that an exception is thrown:
      // When testing async functions, add await before expect and execute the test target within expect
      await expect(itemsService.findById('test-id1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const createItemDto: CreateItemDto = {
      name: 'PC',
      price: 100000,
      description: '未使用品',
    };
    const userId = 'test-user1';

    const item: Item = {
      id: 'test-id1',
      name: createItemDto.name,
      price: createItemDto.price,
      description: createItemDto.description!,
      status: ItemStatus.ON_SALE,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
      userId,
    };
    it('Normal', async () => {
      (prismaService.item.create as jest.Mock).mockResolvedValue(item);
      const result = await itemsService.create(createItemDto, userId);
      expect(result).toEqual(item);
      expect(prismaService.item.create).toHaveBeenCalledWith({
        data: {
          ...createItemDto,
          status: ItemStatus.ON_SALE,
          userId,
        },
      });
    });
  });

  describe('updateStatus', () => {
    it('Normal', async () => {
      const id: string = 'test-id1';
      const userId: string = 'user-id1';
      const item: Item = {
        id,
        name: 'test-item',
        price: 10000,
        description: 'test-description',
        status: ItemStatus.SOLD_OUT,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        userId,
      };
      (prismaService.item.update as jest.Mock).mockResolvedValue(item);
      const result = await itemsService.updateStatus(id);
      expect(result).toEqual(item);
      expect(prismaService.item.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          status: ItemStatus.SOLD_OUT,
        },
      });
    });
  });

  describe('delete', () => {
    it('Normal', async () => {
      const id: string = 'test-id1';
      const userId: string = 'test-user1';
      (prismaService.item.delete as jest.Mock).mockResolvedValue(null);
      const result = await itemsService.delete(id, userId);
      expect(result).toEqual(undefined);
      expect(prismaService.item.delete).toHaveBeenCalledWith({
        where: { id, userId },
      });
    });
  });
});
