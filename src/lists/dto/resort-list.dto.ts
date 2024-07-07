import { IsNotEmpty } from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';

export class ResortListDto {
    @ApiProperty({ example: '[15, 28]]' , description: 'List items Ids'})
    @IsNotEmpty()
    readonly listIds: number[];

    @ApiProperty({ example: '[1, 2]' , description: 'List items order numbers'})
    @IsNotEmpty()
    readonly listNumbers: number[];
}