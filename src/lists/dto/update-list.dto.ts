import { 
    MaxLength,
    MinLength,
} from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';

export class UpdateListDto {
    @ApiProperty({ example: 'Выполнено', description: 'Название списка'})
    @MaxLength(15)
    @MinLength(1)
    readonly title: string;
}