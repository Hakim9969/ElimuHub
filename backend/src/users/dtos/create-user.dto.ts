import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import {$Enums} from "../../../generated/prisma";
import Role = $Enums.Role;

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be ADMIN, INSTRUCTOR, or STUDENT' })
  role?: Role;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role must be ADMIN, INSTRUCTOR, or STUDENT' })
  role?: Role;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}