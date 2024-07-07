import { ApiProperty } from '@nestjs/swagger';
import {
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  ManyToOne, 
  OneToMany, 
  JoinColumn
} from 'typeorm';
import { ProjectEntity } from 'src/projects/projects.entity';
import { TaskEntity } from 'src/tasks/tasks.entity';

interface listCreationAttrs {
  email: string;
  name: string;
  password: string;
}

@Entity('lists')
export class ListEntity {
  @ApiProperty({ example: 15, description: 'Уникальный id списка' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'In progress', description: 'Название' })
  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @ApiProperty({ example: 2, description: 'Номер списка по порядку' })
  @Column({ type: 'smallint'})
  order_number: number;
  
  @ApiProperty({ example: '10', description: 'Уникальный id пользователя' })
  @ApiProperty({ type: () => ProjectEntity })
  @ManyToOne( () => ProjectEntity, (project) => project.ls,{
      onDelete: "CASCADE",
  } )
  project: ProjectEntity;

  @OneToMany(() => TaskEntity, (task) => task.list)
  ts: TaskEntity[];
}