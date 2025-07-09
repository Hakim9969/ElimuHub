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
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/role-decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('INSTRUCTOR')
  create(@Body() dto: CreateCourseDto, @Req() req) {
    return this.coursesService.create(req.user.sub, dto);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get('my')
  @Roles('INSTRUCTOR')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findMyCourses(@Req() req) {
    return this.coursesService.findByInstructor(req.user.sub);
  }

  @Get('/categories')
  getAllCategories() {
  return this.coursesService.findAllCategories();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: string) {
   return this.coursesService.findByCategory(category);
  }

  

  @Patch(':id')
  @Roles('INSTRUCTOR')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto, @Req() req) {
    return this.coursesService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  @Roles('INSTRUCTOR', 'ADMIN')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req) {
    return this.coursesService.remove(id, req.user.sub);
  }
}
