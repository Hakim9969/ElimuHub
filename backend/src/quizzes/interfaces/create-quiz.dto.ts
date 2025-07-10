import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {QuestionType} from "./quiz.interface";

export class CreateQuestionDto {
    @IsString()
    type: QuestionType;

    @IsString()
    text: string;

    @IsArray()
    @IsString({ each: true })
    options: string[];

    @IsString()
    answer: string;

    @IsNumber()
    @IsOptional()
    points?: number = 1;

    @IsNumber()
    @IsOptional()
    order?: number = 0;
}

export class CreateQuizDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    courseId: string;

    @IsOptional()
    @IsNumber()
    timeLimit?: number;

    @IsOptional()
    @IsNumber()
    maxAttempts?: number;

    @IsOptional()
    @IsNumber()
    passingScore?: number = 70;

    @IsOptional()
    @IsBoolean()
    published?: boolean = false;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[];
}