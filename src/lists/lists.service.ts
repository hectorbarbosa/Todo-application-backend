import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { ListEntity } from './lists.entity';
import { ProjectEntity } from 'src/projects/projects.entity';
import { CreateListDto } from './dto/create-list.dto'
import { UpdateListDto } from './dto/update-list.dto'
import { DragListDto } from './dto/drag-list.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class ListsService {
    private listRepository;
    private projectRepository;

    constructor(
        private dataSource: DataSource
) {
    this.listRepository = this.dataSource.getRepository(ListEntity);
    this.projectRepository = this.dataSource.getRepository(ProjectEntity);
}

    async createList(projectId: number, dto: CreateListDto) {
        // console.log(dto);
        const { title } = dto;
        let newList = new ListEntity();
        newList.title = title;
        try {
            let maxNumber = await this.getMaxNumber(projectId);
            newList.order_number = maxNumber + 1;

            const savedList = await this.listRepository.save(newList);

            await this.dataSource
                .createQueryBuilder()
                .relation(ListEntity, "project")
                .of(savedList.id)
                .set(projectId);

            return savedList;
        } catch(error) {
            console.log(error.message);
            throw new HttpException('error creating new list', HttpStatus.BAD_REQUEST);
        }
    }

    async findAll(projectId: number): Promise<ListEntity[]> {
        const lists = await this.listRepository
            .createQueryBuilder('list')
            .where('list."projectId" = :id', {id: projectId})
            .getMany();

        return lists;
    }

    async updateList(id: number, dto: UpdateListDto): Promise<ListEntity> {
        let toUpdate = await this.listRepository.findOneBy({ id: id });
        if (!toUpdate) {
            throw new HttpException('list not found', HttpStatus.NOT_FOUND);
        } 

        try {
            let updated = Object.assign(toUpdate, dto);
            return await this.listRepository.save(updated);
        } catch(error) {
            console.log(error.message);
            throw new HttpException('error updating list', HttpStatus.BAD_REQUEST);
        }
    }

    async deleteList(id: number): Promise<boolean> {
        let exists = await this.listRepository.exists({ 
            where: {id: id },
        });
        if (!exists) {
            throw new HttpException('list not found', HttpStatus.NOT_FOUND);
        } 
        try {
            const result = await this.listRepository.delete(id);
            if (!result) {
                return false;
            } 
            return true;
        } catch(error) {
            console.log(error.message);
            throw new HttpException('error deleting list', HttpStatus.BAD_REQUEST);
        }
    }

    async findById(id: number): Promise<ListEntity> {
        let list = await this.listRepository.findOneBy({ id: id });
        if (!list) {
            throw new HttpException('list not found', HttpStatus.NOT_FOUND);
        } 
        return list;
    }

    async dragList(listId: number, dto: DragListDto) {
        try {
            const { newOrderNumber } = dto;

            // Get project id and dragged list order number
            const projectId = await this.getProjectId(listId);
            const oldOrderNumber = await this.getListOrderNumber(listId);
            if (!projectId || !oldOrderNumber) {
                // no list with such listId 
                throw new HttpException('list not found', HttpStatus.NOT_FOUND);
            }

            // update order_numbers of all lists except dragged 
            const bulkUpdated = await this.setOrderNumbers(projectId, oldOrderNumber, newOrderNumber);
            if (!bulkUpdated) {
                console.log('no order numbers to update')
                // throw new HttpException('no rows to update', HttpStatus.BAD_REQUEST);
            }

            // set order_number for dragged list with lists.id = listId
            const updated = await this.setOneOrderNumber(listId, newOrderNumber);
            if (!updated) {
                console.log('new order number was not set')
                // throw new HttpException("new order number was not set", HttpStatus.BAD_REQUEST);
            }

            return true;
        } catch(error) {
            console.log(error.message);
            throw new HttpException("internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    };

    private async getProjectId(listId: number) {
        try {
            const { id } = await this.listRepository
                .createQueryBuilder('list')
                .select('list."projectId"', 'id')
                .where('list.id = :id', { id: listId })
                .getRawOne();
            
            return id 
        } catch(error) {
            console.log(error)
            throw new HttpException('error getting project id', HttpStatus.BAD_REQUEST);
        }
    }

    private async getListOrderNumber(listId: number): Promise<number> {
        try {
            const { order } = await this.listRepository
                .createQueryBuilder('list')
                .select('list.order_number', 'order')
                .where('list.id = :id', { id: listId })
                .getRawOne();
            
            return order 
        } catch(error) {
            console.log(error)
            throw new HttpException('error getting list order number', HttpStatus.BAD_REQUEST);
        }
    }

    private async setOrderNumbers(
        projectId: number, 
        oldOrderNumber: number, 
        newOrderNumber: number
    ): Promise<boolean> {
        try {
            let result;
            if (newOrderNumber < oldOrderNumber) {
                result = await this.listRepository
                    .createQueryBuilder()
                    .update()
                    .set({ order_number: () => 'lists.order_number + 1' })
                    .where(`lists."projectId" = ${projectId}`)
                    .andWhere( `lists.order_number >= ${newOrderNumber}` )
                    .andWhere( `lists.order_number < ${oldOrderNumber}` ) 
                    .execute()
                    // .getQuery()
                    // console.log(query);

            } else if (newOrderNumber > oldOrderNumber) {
                result = await this.listRepository
                    .createQueryBuilder()
                    .update()
                    .set({ order_number: () => 'lists.order_number - 1' })
                    .where(`lists."projectId" = ${projectId}`)
                    .andWhere( `lists.order_number <= ${newOrderNumber}` )
                    .andWhere( `lists.order_number > ${oldOrderNumber}` )
                    // .getQuery()
                    .execute()
            }
            
            // console.log(result) // undefined if no lists to shift
            if (!result || !result.affected) {
                return false;
            }
            return true;

        }
        catch (error) {
            console.log(error)
            throw new HttpException('error setting order numbers', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async setOneOrderNumber(listId: number, newOrderNumber: number): 
    Promise<boolean> {
        try {
            const result = await this.listRepository
                .createQueryBuilder()
                .update()
                .set({ order_number: newOrderNumber })
                .where("id = :id", { id: listId })
                .execute();

            if (!result.affected) {
                return false;
            }
            return true;
        } catch(error) {
            console.log(error)
            throw new HttpException('error setting order number', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async getMaxNumber(projectId: number): Promise<number> {
        try {
            const { max } = await this.listRepository
                .createQueryBuilder('list')
                .select('MAX(list.order_number)', 'max')
                .where('list."projectId" = :id', { id: projectId })
                .getRawOne();
            
            if (!max) {
                return 0
            }
            return max 
        } catch(error) {
            console.log(error)
            throw new HttpException('error getting max number', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async isValidListUser(listId: number, userId: number) {
        try {
            const result = await this.projectRepository
                .createQueryBuilder('project')
                .select('project.id', 'id')
                .innerJoin(
                     'project.ls', 'lists'
                )
                .where('project."userId" = :userId', { userId })
                .andWhere('lists.id = :listId', { listId })
                .getCount();
            
            // console.log(userId, listId, result);
            return result === 1 ? true : false;
        }
        catch(error) {
            console.log(error)
            throw new HttpException('internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
