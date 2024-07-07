import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/users.entity';
import { SignInUserDto } from 'src/users/dto/sign-in-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async signIn(userDto: SignInUserDto) {
        const user = await this.validateUser(userDto);
        return this.generateToken(user);
    }

    async registration(userDto: CreateUserDto) {
        const applicant = await this.usersService.findUserByEmail(userDto.email)
        if (applicant) {
            const errors = {Auth: "email is already taken"};
            throw new HttpException(errors, HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5)
        const user = await this.usersService.createUser({
            ...userDto, 
            password: hashPassword
        });

        return this.generateToken(user);
    }

    private async generateToken(user: UserEntity) {
        const payload = { id: user.id, email: user.email }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: SignInUserDto) {
        const user = await this.usersService.findUserByEmail(userDto.email);
        const passwordEqual = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEqual) {
            return user;
        }
        const errors = {Auth: "incorrect email or password"};
        throw new UnauthorizedException(errors); 
    }
}
