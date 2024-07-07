import { 
    MaxLength,
    MinLength,
} from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
    @ApiProperty({ example: 'Мой проект to-do list', description: 'Название проекта'})
    @MaxLength(80)
    @MinLength(1)
    readonly title: string;
    @ApiProperty({ example: 'To-do list, NestJs, Typeorm, PostgreSQL', description: 'Описание проекта'})
    readonly description: string;
}