import { Controller, Post , Get, Put, Delete, Patch, Body, Param, UseGuards} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { DragTaskDto } from './dto/drag-task.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskEntity } from './tasks.entity';
import { ListAuthGuard } from 'src/auth/list.auth.guard';
import { TaskAuthGuard } from 'src/auth/task.auth.guard';
import { DragTaskAuthGuard } from 'src/auth/dragtask.auth.guard';

@ApiTags('Задачи')
@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @ApiOperation({ summary: "Добавить задачу" })
    @ApiResponse({ status: 201, type: TaskEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(ListAuthGuard)
    @Post('/:id')
    @ApiBearerAuth('JWT-auth')
    async create(@Param() params, @Body() taskDto: CreateTaskDto) {
        return await this.tasksService.createTask(params.id, taskDto);
    }

    @ApiOperation({ summary: "Получить все задачи из списка" })
    @ApiResponse({ status: 200, type: [TaskEntity] })
    @UseGuards(ListAuthGuard)
    @Get('/all/:id')
    @ApiBearerAuth('JWT-auth')
    async getAll(@Param() params) {
        return await this.tasksService.findAll(params.id);
    }

    @ApiOperation({ summary: "Отредактировать задачу по id" })
    @ApiResponse({ status: 200, type: TaskEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(TaskAuthGuard)
    @Put('/:id')
    @ApiBearerAuth('JWT-auth')
    async update(@Param() params, @Body() dto: UpdateTaskDto) {
        return await this.tasksService.updateTask(params.id, dto);
    }

    @ApiOperation({ summary: "Удалить задачу по id" })
    @ApiResponse({ status: 200, type: TaskEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(TaskAuthGuard)
    @Delete('/:id')
    @ApiBearerAuth('JWT-auth')
    async delete(@Param() params) {
        return await this.tasksService.deleteTask(params.id);
    }
    
    @ApiOperation({ summary: "Получить задачу по id" })
    @ApiResponse({ status: 200, type: TaskEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(TaskAuthGuard)
    @Get('/:id')
    @ApiBearerAuth('JWT-auth')
    async findTaskById(@Param() params) {
        const list = await this.tasksService.findById(params.id);
        return list;
    }

    @ApiOperation({ summary: "Перетаскивание задачи" })
    @ApiResponse({ status: 200, type: TaskEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(DragTaskAuthGuard)
    @Patch('/drag/:listId/:taskId')
    @ApiBearerAuth('JWT-auth')
    async dragList(@Param() params, @Body() dto: DragTaskDto) {
        const result = await this.tasksService.dragTask(params.listId, params.taskId, dto);
        return result;
    }
}
