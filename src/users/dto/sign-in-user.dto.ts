import { 
    IsEmail,
    IsNotEmpty, 
    MaxLength,
    MinLength,
} from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto {
    @ApiProperty({ example: 'mymail@somemail.com', description: 'email'})
    @IsEmail()
    readonly email: string;
    @ApiProperty({ example: 'secret_password', description: 'Пароль'})
    @IsNotEmpty()
    readonly password: string;
}