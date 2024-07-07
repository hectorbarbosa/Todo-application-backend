import { 
    MaxLength,
    MinLength,
} from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
    @ApiProperty({ example: 'Выполнить работу или задачу', description: 'Название задачи' })
    @MaxLength(30)
    @MinLength(2)
    readonly title: string;
    @ApiProperty({ example: 'Очень полезная работа', description: 'Описание задачи' })
    readonly description: string;
}