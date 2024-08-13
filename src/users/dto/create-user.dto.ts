import { 
    IsEmail,
    IsNotEmpty, 
    MaxLength,
    MinLength,
} from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'mail@example.org', description: 'email'})
    @IsEmail()
    readonly email: string;
    @ApiProperty({ example: 'jon', description: 'Имя пользователя'})
    @MaxLength(12)
    @MinLength(2)
    @IsNotEmpty()
    readonly name: string;
    @ApiProperty({ example: '123', description: 'Пароль'})
    @IsNotEmpty()
    readonly password: string;
}