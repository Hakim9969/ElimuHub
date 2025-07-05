import {IsString} from "class-validator";

export class StartQuizDto {
    @IsString()
    userId: string;
}