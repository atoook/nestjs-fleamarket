import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma/prisma.service';
import { Item } from '../../generated/prisma';
import { NotFoundException } from '@nestjs/common';

// Mock PrismaService for testing
const mockPrismaService = {
  item: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
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
});
