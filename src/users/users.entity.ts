import { ApiProperty } from '@nestjs/swagger';
import { ProjectEntity } from 'src/projects/projects.entity';
import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm'
// import { IsEmail } from 'class-validator';

interface userCreationAttrs {
  email: string;
  name: string;
  password: string;
}

@Entity('users')
export class UserEntity {
  @ApiProperty({ example: 10, description: 'Уникальный id'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'mymail@somemail.com', description: 'email'})
  // @IsEmail()
  @Column({ type: 'varchar', nullable: false })
  email: string;

  @ApiProperty({ example: 'Petr', description: 'Имя пользователя'})
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @ApiProperty({ example: '123456', description: 'Пароль'})
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @OneToMany(() => ProjectEntity, (p) => p.user)
  ps: ProjectEntity[]; 
}