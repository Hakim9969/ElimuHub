import { Module } from '@nestjs/common';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import {PrismaService} from "../prisma/prisma.service";

@Module({
  controllers: [QuizzesController],
  providers: [QuizzesService, PrismaService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
