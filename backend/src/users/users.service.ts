import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dtos';
import * as crypto from 'crypto';
import { IuserService, UserResponse } from './interfaces/user.interface';
import {User} from "../../generated/prisma";

type UserWithRelations = User & {
  courses: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    objectives: string | null;
    prerequisites: string | null;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    instructorId: string;
  }>;
  enrollments: Array<{
    id: string;
    userId: string;
    courseId: string;
    enrolledAt: Date;
  }>;
  quizAttempts: Array<{
    id: string;
    userId: string;
    quizId: string;
    score: number;
    submittedAt: Date;
  }>;
  certificates: Array<{
    id: string;
    userId: string;
    courseId: string;
    issuedAt: Date;
  }>;
  reviews: Array<{
    id: string;
    userId: string;
    courseId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
};

@Injectable()
export class UserService implements IuserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<UserResponse> {
    // Check if user with email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user in database
    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.toLowerCase().trim(),
        phone: dto.phone?.trim(),
        password: hashedPassword,
        role: dto.role || 'STUDENT',
        verified: dto.verified || false,
      },
    });

    // Return user without password
    return this.excludePassword(user);
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        courses: true,
        enrollments: true,
        quizAttempts: true,
        certificates: true,
        reviews: true,
      },
    });

    // Remove passwords from all users
    return users.map((user) => this.excludePassword(user));
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        courses: true,
        enrollments: true,
        quizAttempts: true,
        certificates: true,
        reviews: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.excludePassword(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(
      id: string,
      updateUserDto: UpdateUserDto,
      requester?: any
  ): Promise<UserResponse> {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

     // Prevent role update unless requester is ADMIN
  if (updateUserDto.role && requester?.role !== 'ADMIN') {
    throw new ConflictException('Only admins can change user roles');
  }

    // Check if email is being updated and if it's already taken
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailTaken) {
        throw new ConflictException('Email is already used');
      }
    }

    // Prepare update data
    const updateData: any = { ...updateUserDto };

    // Hash password if it's being updated
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Update user and include relations
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        courses: true,
        enrollments: true,
        quizAttempts: true,
        certificates: true,
        reviews: true,
      },
    });

    return this.excludePassword(updatedUser);
  }

  async remove(id: string): Promise<void> {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete user (this will cascade delete related records)
    await this.prisma.user.delete({
      where: { id },
    });
  }


  async resetPassword(email: string): Promise<void> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    // Generate reset token
    const resetToken = this.generateResetToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    // Save reset token to database
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    });
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  private excludePassword(user: User): Omit<User, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}