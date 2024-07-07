import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInUserDto } from 'src/users/dto/sign-in-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Controller, Post, Body} from '@nestjs/common';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: "Авторизация" })
    @ApiResponse({ status: 200, description: "Пользовательский токен" })
    @Post('/login')
    signIn(@Body() userDto: SignInUserDto) {
        return this.authService.signIn(userDto);
    }

    @ApiOperation({ summary: "Регистрация" })
    @ApiResponse({ status: 201, description: "Пользовательский токен" })
    @Post('/registration')
    registration(@Body() userDto: CreateUserDto) {
        return this.authService.registration(userDto);
    }
}
