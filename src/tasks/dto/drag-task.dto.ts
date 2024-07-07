import { IsNotEmpty, IsInt, IsNumber } from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';

export class DragTaskDto {
    @ApiProperty({ example: '2' , description: 'New order number'})
    @IsNumber()
    @IsNotEmpty()
    readonly newOrderNumber: number;
    
    // @ApiProperty({ example: '1005' , description: 'Task id'})
    // @IsNumber()
    // @IsNotEmpty()
    // readonly newListId: number;
}
