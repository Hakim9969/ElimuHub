import { IsInt, IsString } from 'class-validator';

export class CreateContentDto {
  @IsString()
  title: string;

  @IsInt()
  order: number;
}
