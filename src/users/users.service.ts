import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { DataSource } from 'typeorm';
// import { DataSource } from "typeorm"

@Injectable()
export class UsersService {
    private userRepository;

    constructor(
        private dataSource: DataSource
) {
    this.userRepository = this.dataSource.getRepository(UserEntity);
}

    async createUser(dto: CreateUserDto): Promise<UserEntity> {
        try {
            const {email, name, password} = dto;
            let newUser = new UserEntity();
            newUser.email = email;
            newUser.name = name;
            newUser.password = password;
            
            const savedUser = await this.userRepository.save(newUser);
            return savedUser;
        } catch(error) {
            throw new HttpException('error creating new user', HttpStatus.BAD_REQUEST)
        }
    }

    async findAll(): Promise<UserEntity[]> {
        const users = await this.userRepository.find();
        return users;
    }

    async updateUser(id: number, dto: UpdateUserDto): Promise<UserEntity> {
        let toUpdate = await this.userRepository.findOneBy({ id: id });
        if (!toUpdate) {
            throw new HttpException('error updating user', HttpStatus.NOT_FOUND);
        } 
        delete toUpdate.password;

        let updated = Object.assign(toUpdate, dto);
        return await this.userRepository.save(updated);
    }

    async deleteUser(id: number): Promise<boolean> {
        let exists = await this.userRepository.exists({ 
            where: {id: id },
        });
        if (!exists) {
            throw new HttpException('error deleting user', HttpStatus.NOT_FOUND);
        } 
        try {
            const result = await this.userRepository.delete(id);
            if (!result) {
                return false;
            } 
            return true;
        }
        catch(error) {
            console.log(error.message);
            throw new HttpException('user has projects', HttpStatus.BAD_REQUEST) 
        }
    }

    async findUserById(id: number): Promise<UserEntity> {
        let user = await this.userRepository.findOneBy({ id: id });
        if (!user) {
            throw new HttpException('user not found', HttpStatus.NOT_FOUND);
        } 
        return user;
    }

    async findUserByEmail(email: string): Promise<UserEntity> {
        let user = await this.userRepository.findOneBy({ email: email });
        return user;
    }
}
