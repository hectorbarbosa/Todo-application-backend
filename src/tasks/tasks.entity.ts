import { ApiProperty } from '@nestjs/swagger';
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm'
import { ListEntity } from 'src/lists/lists.entity';

@Entity('tasks')
export class TaskEntity {
    @ApiProperty({ example: 11, description: 'Уникальный id задачи' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'To-do list', description: 'Название задачи' })
    @Column({ type: 'varchar', length: 50, nullable: false })
    title: string;

    @ApiProperty({ example: 'Краткое описание задачи', description: 'Описание задачи' })
    @Column({ type: 'varchar', length: 100, default: ''})
    description: string;

    @ApiProperty({ example: 7, description: 'Номер задачи по порядку' })
    @Column({ type: 'smallint', nullable: false })
    order_number: number;

    @ApiProperty({ example: '2024-03-01', description: 'Дата создания' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created: Date;

    @ApiProperty({ example: '10', description: 'Уникальный id' })
    @ApiProperty({ type: () => ListEntity })
    @ManyToOne( () => ListEntity, (list) => list.ts, {
        lazy: true,
        onDelete: "CASCADE",
    })
    list: ListEntity;
}