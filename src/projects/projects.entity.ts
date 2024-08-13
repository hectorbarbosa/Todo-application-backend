import { ApiProperty } from '@nestjs/swagger';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm'
import { UserEntity } from '../users/users.entity';
import { ListEntity } from '../lists/lists.entity';
// import { IsNotEmpty } from 'class-validator';

interface projectCreationAttrs {
  email: string;
  name: string;
  password: string;
}

@Entity('projects')
export class ProjectEntity {
  @ApiProperty({ example: 1115, description: 'Уникальный id проекта' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'To-do list', description: 'Название проекта' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @ApiProperty({ example: '123456', description: 'Описание проекта' })
  @Column({ type: 'varchar', length: 100, default: ''})
  description: string;

  @ApiProperty({ example: '2024-03-01', description: 'Дата создания' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  
  @ApiProperty({ example: '10', description: 'Уникальный id пользователя' })
  @ApiProperty({ type: () => UserEntity })
  @ManyToOne( () => UserEntity, u => u.ps, {
      onDelete: "CASCADE",
  }) 
  user: UserEntity;

  @OneToMany(() => ListEntity, (list) => list.project)
  ls: ListEntity[];
}