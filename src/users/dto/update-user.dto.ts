import { 
    IsEmail,
    IsNotEmpty, 
    MaxLength,
    MinLength,
} from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ example: 'mymail@somemail.com', description: 'email'})
    @IsEmail()
    readonly email: string;
    @ApiProperty({ example: 'Евгений', description: 'Имя пользователя'})
    @IsNotEmpty()
    @MaxLength(12)
    @MinLength(2)
    readonly name: string;
}