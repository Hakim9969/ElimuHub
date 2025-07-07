import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProgressModule } from 'src/progress/progress.module';

@Module({
  imports: [ProgressModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService, PrismaService],
  exports: [EnrollmentService]
})
export class EnrollmentModule { }