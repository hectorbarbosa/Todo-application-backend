import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskEntity } from './tasks.entity';
import { ListEntity } from 'src/lists/lists.entity';
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { DragTaskDto } from './dto/drag-task.dto'
import { DataSource } from 'typeorm';
import { ProjectEntity } from 'src/projects/projects.entity';
import { query } from 'express';

@Injectable()
export class TasksService {
    private taskRepository;
    private listRepository;
    private projectRepository;

    constructor(
        private dataSource: DataSource
) {
    this.taskRepository = this.dataSource.getRepository(TaskEntity);
    this.listRepository = this.dataSource.getRepository(ListEntity);
    this.projectRepository = this.dataSource.getRepository(ProjectEntity);
}

    async createTask(listId: number, dto: CreateTaskDto) {
        // console.log(dto);
        const {title, description} = dto;
        let newTask = new TaskEntity();
        newTask.title = title;
        if (description) {
            newTask.description = description;
        }

        try {
            let maxNumber = await this.getMaxNumber(listId)
            newTask.order_number = maxNumber + 1;

            const savedTask = await this.taskRepository.save(newTask);

            await this.dataSource
                .createQueryBuilder()
                .relation(TaskEntity, "list")
                .of(savedTask.id)
                .set(listId);

            return savedTask;
        } catch(error) {
            console.log(error.message);
            throw new HttpException('error creating new task', HttpStatus.BAD_REQUEST);
        }
    }

    async findAll(listId: number): Promise<TaskEntity[]> {
        const tasks = await this.taskRepository
            .createQueryBuilder('task')
            .where('task."listId" = :id', {id: listId})
            .getMany();
        return tasks;
    }

    async updateTask(id: number, dto: UpdateTaskDto): Promise<TaskEntity> {
        let toUpdate = await this.taskRepository.findOneBy({ id: id });
        if (!toUpdate) {
            throw new HttpException('task not found', HttpStatus.NOT_FOUND);
        } 

        try {
            let updated = Object.assign(toUpdate, dto);
            return await this.taskRepository.save(updated);
        } catch(error) {
            console.log(error.message);
            throw new HttpException('error updating task', HttpStatus.BAD_REQUEST);
        }
    }

    async deleteTask(id: number): Promise<boolean> {
        let exists = await this.taskRepository.exists({ 
            where: {id: id },
        });
        if (!exists) {
            throw new HttpException('task not found', HttpStatus.NOT_FOUND);
        } 

        try {
            const result = await this.taskRepository.delete(id);
            if (!result) {
                return false;
            } 
            return true;
        } catch(error) {
            console.log(error.message);
            throw new HttpException('error deleting task', HttpStatus.BAD_REQUEST);
        }
    }

    async findById(id: number): Promise<TaskEntity> {
        let task = await this.taskRepository.findOneBy({ id: id });
        if (!task) {
            throw new HttpException('task not found', HttpStatus.NOT_FOUND);
        } 
        return task;
    }

    async dragTask(newListId: number, taskId: number, dto: DragTaskDto) {
        const { newOrderNumber } = dto;

        // Get old list id 
        const listId = await this.getListId(taskId); 
        // Get task order number
        const oldOrderNumber = await this.getOrderNumber(taskId);
        // shift all other task numbers
        if (newListId === listId) {
            // console.log("");
            const affected = await this.changeNumbers(listId, oldOrderNumber, newOrderNumber);
            if (!affected) {
                console.log('no shifted task order numbers')
            }
            return await this.setOrderNumber(newOrderNumber, taskId);
        } else {
            await this.shiftDown(newListId, newOrderNumber);
            await this.shiftUp(listId, oldOrderNumber);
            return await this.setOrderNumAndListId(
                taskId,
                newListId,
                newOrderNumber,
            );
        }
    };

    private async getListId(taskId: number) {
        try {
            let { listId } = await this.taskRepository
                .createQueryBuilder('task')
                .select('task."listId"', 'listId')
                .where("task.id = :id", { id: taskId })
                .getRawOne();

            // console.log(listId);
            return listId;
        }
        catch(error) {
            console.log(error);
            throw new HttpException('error getting task id', HttpStatus.BAD_REQUEST);
        }
    }

    private async getOrderNumber(taskId: number) {
        try {
            let { orderNumber } = await this.taskRepository
                .createQueryBuilder('task')
                .select('task.order_number', 'orderNumber')
                .where("task.id = :id", { id: taskId })
                .getRawOne();

            console.log(orderNumber);
            return orderNumber;
        }
        catch(error) {
            console.log(error);
            throw new HttpException('error getting task order number', HttpStatus.BAD_REQUEST);
        }
    }

    private async setOrderNumber(
        newOrderNumber: number, 
        taskId: number
    ) {
        try {
            const result = await this.taskRepository
                .createQueryBuilder()
                .update(TaskEntity)
                .set({ order_number: newOrderNumber })
                .where("id = :id", { id: taskId })
                .execute();

            const affected = result.affected;
            // console.log(affected);
            if (!affected) {
                const errors = {Task: "task not found"};
                throw new HttpException({errors}, 404);
            }
            return true
        }
        catch(error) {
            console.log(error);
            throw new HttpException('error setting task order number', HttpStatus.BAD_REQUEST);
        }
    }

    private async changeNumbers(
        listId: number, 
        oldOrderNumber: number, 
        newOrderNumber: number
    ) {
        try {
            let result;
            if (newOrderNumber < oldOrderNumber) {
                result = await this.taskRepository
                    .createQueryBuilder()
                    .update()
                    .set({ order_number: () => 'tasks.order_number + 1' })
                    .where(`tasks."listId" = ${listId}`)
                    .andWhere( `tasks.order_number >= ${newOrderNumber}` )
                    .andWhere( `tasks.order_number < ${oldOrderNumber}` ) 
                    .execute()
                    // .getQuery()

                    // console.log(query);

            } else if (newOrderNumber > oldOrderNumber) {
                result = await this.taskRepository
                    .createQueryBuilder()
                    .update()
                    .set({ order_number: () => 'tasks.order_number - 1' })
                    .where(`tasks."listId" = ${listId}`)
                    .andWhere( `tasks.order_number <= ${newOrderNumber}` )
                    .andWhere( `tasks.order_number > ${oldOrderNumber}` )
                    // .getQuery()
                    .execute()

                    // console.log(query);
            }

            // console.log(result) // undefined if no tasks to shift
            if (!result || !result.affected) {
                return false;
            }
            return true;
        }
        catch(error) {
            console.log(error);
            throw new HttpException('error changing task order number', HttpStatus.BAD_REQUEST);
        }
    }

    private async shiftDown(newListId: number, newOrderNumber: number) {
         try {
             const query = this.taskRepository
                .createQueryBuilder()
                .update()
                .set({ order_number: () => 'order_number + 1' })
                .where(`tasks."listId" = ${newListId}`)
                .andWhere( `tasks.order_number >= ${newOrderNumber}` )
                .execute()
         }
         catch(error) {
             console.log(error);
            throw new HttpException('error shifting down', HttpStatus.BAD_REQUEST);
         }
    }

    private async shiftUp(oldListId: number, oldOrderNumber: number) {
         try {
             const query = this.taskRepository
                .createQueryBuilder()
                .update()
                .set({ order_number: () => 'order_number - 1' })
                .where(`tasks."listId" = ${oldListId}`)
                .andWhere( `tasks.order_number > ${oldOrderNumber}` )
                .execute()
         }
         catch(error) {
             console.log(error);
            throw new HttpException('error shifting up', HttpStatus.BAD_REQUEST);
         }
    }

    private async setOrderNumAndListId(
        taskId: number, 
        newListId: number, 
        newOrderNumber: number
    ) {
        try {
            const result1 = await this.dataSource
                .createQueryBuilder()
                .relation(TaskEntity, "list")
                .of(taskId)
                .set(newListId);

            const result2 = await this.taskRepository
                .createQueryBuilder()
                .update(TaskEntity)
                .set({ order_number: newOrderNumber })
                .where("id = :id", { id: taskId })
                .execute();
           
            const affected = result2.affected;
            // console.log(affected);
            if (!affected) {
                throw new HttpException('task not found', HttpStatus.NOT_FOUND);
            }
            return true
        }
        catch(error) {
             console.log(error);
            throw new HttpException('error setting num and id', HttpStatus.BAD_REQUEST);
        }
    }

    private async getMaxNumber(listId: number) {
        try {
            const { max } = await this.taskRepository
                .createQueryBuilder('task')
                .select('MAX(task.order_number)', 'max')
                .where('task."listId" = :id', { id: listId })
                .getRawOne();
            
            if (!max) {
                return 0
            }
            return max 
        } catch(error) {
            console.log(error)
            throw new HttpException('task not found', HttpStatus.NOT_FOUND);
        }
    }
    
    async isValidTaskUser(taskId: number, userId: number) {
        try {
            const result = await this.projectRepository
                .createQueryBuilder('project')
                .innerJoinAndSelect(
                     'project.ls', 'lists'
                )
                .innerJoinAndSelect(
                     'lists.ts', 'tasks'
                )
                .where('project."userId" = :userId', { userId })
                .andWhere('tasks.id = :taskId', { taskId })
                .getCount();
            
            // console.log(userId, taskId, result);
            return result === 1 ? true : false;
        }
        catch(error) {
            console.log(error)
            throw new HttpException('internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async isValidNewList(listId: number, userId: number) {
        try {
            const result = await this.projectRepository
                .createQueryBuilder('project')
                .select('project.id', 'id')
                .innerJoin(
                     'project.ls', 'lists'
                )
                .where('project."userId" = :userId', { userId })
                .andWhere('lists.id = :listId', { listId })
                // .getQuery()
                .getCount();
            
            // console.log(query)
            // console.log(userId, listId, result);
            return result === 1 ? true : false;
            // return false;
        }
        catch(error) {
            console.log(error)
            throw new HttpException('internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
