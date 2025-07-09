import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { Role } from 'generated/prisma';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
  @IsEnum(Role, { message: 'Role must be ADMIN, INSTRUCTOR, or STUDENT' })
  role?: Role;
}
