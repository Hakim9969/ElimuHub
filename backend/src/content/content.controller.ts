import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role-decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('INSTRUCTOR')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('courses/:courseId/contents')
  create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateContentDto,
    @Req() req,
  ) {
    return this.contentService.create(courseId, req.user.sub, dto);
  }

  @Get('courses/:courseId/contents')
  findAll(@Param('courseId') courseId: string) {
    return this.contentService.findAll(courseId);
  }

  @Patch('courses/:courseId/contents/:id')
  update(@Param('id') id: string, @Body() dto: UpdateContentDto) {
    return this.contentService.update(id, dto);
  }

  @Delete('courses/:courseId/contents/:id')
  @Roles('INSTRUCTOR', 'ADMIN')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req) {
    return this.contentService.remove(id, req.user.sub, req.user.role);
  }
}