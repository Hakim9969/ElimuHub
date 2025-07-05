import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ProgressService, PrismaService],
  controllers: [ProgressController],
  exports: [ProgressService]
})
export class ProgressModule {}
