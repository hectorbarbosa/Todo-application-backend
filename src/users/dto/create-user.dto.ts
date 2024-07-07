import { 
    IsEmail,
    IsNotEmpty, 
    MaxLength,
    MinLength,
} from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'mymail@somemail.com', description: 'email'})
    @IsEmail()
    readonly email: string;
    @ApiProperty({ example: 'Евгений', description: 'Имя пользователя'})
    @MaxLength(12)
    @MinLength(2)
    @IsNotEmpty()
    readonly name: string;
    @ApiProperty({ example: 'secret_password', description: 'Пароль'})
    @IsNotEmpty()
    readonly password: string;
}