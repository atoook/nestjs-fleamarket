import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // PrismaServiceを他のモジュールで使用できるようにエクスポート
})
export class PrismaModule {}
