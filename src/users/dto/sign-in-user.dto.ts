import { 
    IsEmail,
    IsNotEmpty, 
    MaxLength,
    MinLength,
} from 'class-validator'; 
import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto {
    @ApiProperty({ example: 'mail@example.org', description: 'email'})
    @IsEmail()
    readonly email: string;
    @ApiProperty({ example: '123', description: 'Пароль'})
    @IsNotEmpty()
    readonly password: string;
}