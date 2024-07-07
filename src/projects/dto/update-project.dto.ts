import { 
    MaxLength,
    MinLength,
} from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
    @ApiProperty({ example: 'Котики', description: 'Название проекта'})
    @MaxLength(80)
    @MinLength(1)
    readonly title: string;
    @ApiProperty({ example: 'Самый интересный проект про котиков', description: 'Описание проекта'})
    readonly description: string;
}