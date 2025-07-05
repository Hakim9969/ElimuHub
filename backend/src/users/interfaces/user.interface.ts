import { CreateUserDto, UpdateUserDto } from '../dtos';
import {$Enums} from "../../../generated/prisma";
import Role = $Enums.Role;


export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  phone: string | null;
  profilePicture: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
   sub?: string;
  id: string;
  email: string;
  name: string;
  profilePicture: string | null;
  role: Role;
  verified: boolean;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IuserService {
  create(dto: CreateUserDto): Promise<UserResponse>;

  findAll(): Promise<UserResponse[]>;

  findOne(id: string): Promise<UserResponse>;

  findByEmail(email: string): Promise<User | null>;

  update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse>;

  remove(id: string): Promise<void>;

  resetPassword(email: string): Promise<void>;
}
