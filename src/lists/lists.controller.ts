import { Controller, Post , Get, Put, Patch, Delete, Body, Param, UseGuards} from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { DragListDto } from './dto/drag-list.dto';
import { ResortListDto } from './dto/resort-list.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListEntity } from './lists.entity';
import { ListAuthGuard } from 'src/auth/list.auth.guard';
import { ProjectAuthGuard } from 'src/auth/project.auth.guard';

@ApiTags('Списки задач')
@Controller('lists')
export class ListsController {
    constructor(private listsService: ListsService) {}

    @ApiOperation({ summary: "Добавить список" })
    @ApiResponse({ status: 201, type: ListEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(ProjectAuthGuard)
    @Post('/:id')
    @ApiBearerAuth('JWT-auth')
    async create(@Param() params, @Body() listDto: CreateListDto) {
        // console.log('create user')
        return await this.listsService.createList(params.id, listDto);
    }

    @ApiOperation({ summary: "Получить все списки по проекту" })
    @ApiResponse({ status: 200, type: [ListEntity] })
    @UseGuards(ProjectAuthGuard)
    @ApiParam({ name: 'id', required: true })
    @Get('all/:id')
    @ApiBearerAuth('JWT-auth')
    async getAll(@Param() params) {
        // get all lists of a project specified in params.id
        return await this.listsService.findAll(params.id);
    }

    @ApiOperation({ summary: "Отредактировать список по id" })
    @ApiResponse({ status: 200, type: ListEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(ListAuthGuard)
    @Put('/:id')
    @ApiBearerAuth('JWT-auth')
    async update(@Param() params, @Body() dto: UpdateListDto) {
        return await this.listsService.updateList(params.id, dto);
    }

    @ApiOperation({ summary: "Удалить список по id" })
    @ApiResponse({ status: 200, type: ListEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(ListAuthGuard)
    @Delete('/:id')
    @ApiBearerAuth('JWT-auth')
    async delete(@Param() params) {
        return await this.listsService.deleteList(params.id);
    }
    
    @ApiOperation({ summary: "Получить список по id" })
    @ApiResponse({ status: 200, type: ListEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(ListAuthGuard)
    @Get('/:id')
    @ApiBearerAuth('JWT-auth')
    async findListById(@Param() params) {
        const list = await this.listsService.findById(params.id);
        return list;
    }

    @ApiOperation({ summary: "Перетаскивание списка" })
    @ApiResponse({ status: 200, type: ListEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(ListAuthGuard)
    @Patch('/drag/:id')
    @ApiBearerAuth('JWT-auth')
    async dragList(@Param() params, @Body() dto: DragListDto) {
        const result = await this.listsService.dragList(params.id, dto);
        return result;
    }

}
