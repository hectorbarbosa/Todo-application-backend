import { Controller, Post , Get, Put, Delete, Body, Param, UseGuards, Req, UnauthorizedException, HttpException} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './users.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    // @ApiOperation({ summary: "adding user" })
    // @ApiResponse({ status: 201, type: UserEntity })
    // @Post()
    // create(@Body() userDto: CreateUserDto) {
    //     // console.log('create user')
    //     return this.usersService.createUser(userDto);
    // }

    @ApiOperation({ summary: "get all users" })
    @ApiResponse({ status: 200, type: [UserEntity] })
    @UseGuards(AuthGuard)
    @Get()
    @ApiBearerAuth('JWT-auth')
    async getAll() {
        return await this.usersService.findAll();
    }

    @ApiOperation({ summary: "updating user by id" })
    @ApiResponse({ status: 200, type: UserEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(AuthGuard)
    @Put('/:id')
    async update(@Req() request: Request, @Param() params, @Body() dto: UpdateUserDto) {
        if ( request['user'].id !== parseInt(params.id)) {
            throw new UnauthorizedException();
        } 
        return await this.usersService.updateUser(params.id, dto);
    }

    @ApiOperation({ summary: "Удалить текущего пользователя со всеми проектами" })
    @ApiResponse({ status: 200, type: UserEntity })
    @UseGuards(AuthGuard)
    @Delete()
    @ApiBearerAuth('JWT-auth')
    async delete(@Req() request: Request, @Param() params) {
        return await this.usersService.deleteUser(request['user']['id']);
    }
    
    @ApiOperation({ summary: "get user by id" })
    @ApiResponse({ status: 200, type: UserEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(AuthGuard)
    @Get('/:id')
    @ApiBearerAuth('JWT-auth')
    async findUserById(@Req() request: Request, @Param() params) {
        if ( request['user'].id !== parseInt(params.id)) {
            throw new UnauthorizedException();
        } 
        const user = await this.usersService.findUserById(params.id);
        return user;
    }
}
