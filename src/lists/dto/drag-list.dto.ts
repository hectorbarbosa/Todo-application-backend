import { IsNotEmpty, IsInt, IsNumber } from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';

export class DragListDto {
    @ApiProperty({ example: '2' , description: 'New order number'})
    @IsNumber()
    @IsNotEmpty()
    readonly newOrderNumber: number;
}
