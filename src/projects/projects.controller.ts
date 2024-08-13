import { Controller, Post , Get, Put, Delete, Body, Param, UseGuards, Req, UnauthorizedException, HttpStatus} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectEntity } from './projects.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProjectAuthGuard } from 'src/auth/project.auth.guard';

@ApiTags('Проекты')
@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @ApiOperation({ summary: "Добавить проект" })
    @ApiResponse({ status: 201, type: ProjectEntity })
    // @ApiResponse({ status: 401, type: "Bad request" })
    @UseGuards(AuthGuard)
    @Post()
    @ApiBearerAuth('JWT-auth')
    async create(
        @Req() request: Request,
        @Body() projectDto: CreateProjectDto
    ) {
        return await this.projectsService.createProject(request['user']['id'], projectDto);
    }

    @ApiOperation({ summary: "Получить все проекты пользователя" })
    @ApiResponse({ status: 200, type: [ProjectEntity] })
    @UseGuards(AuthGuard)
    @Get('/all')
    @ApiBearerAuth('JWT-auth')
    async getAll(@Req() request: Request) {
        return await this.projectsService.findAll(request['user']['id']);
    }

    @ApiOperation({ summary: "Отредактировать проект по id" })
    @ApiResponse({ status: 200, type: ProjectEntity })
    @UseGuards(ProjectAuthGuard)
    @ApiParam({ name: 'id', required: true })
    @Put('/:id')
    @ApiBearerAuth('JWT-auth')
    async update(@Param() params, @Body() dto: UpdateProjectDto) {
        return await this.projectsService.updateProject(params.id, dto);
    }

    @ApiOperation({ summary: "Удалить проект по id" })
    @ApiResponse({ status: 200, type: ProjectEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(ProjectAuthGuard)
    @Delete('/:id')
    @ApiBearerAuth('JWT-auth')
    async delete(@Param() params) {
        return await this.projectsService.deleteProject(params.id);
    }
    
    @ApiOperation({ summary: "Получить project по id" })
    @ApiResponse({ status: 200, type: ProjectEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(ProjectAuthGuard)
    @Get('/:id')
    @ApiBearerAuth('JWT-auth')
    async findProjectById(@Param() params) {
        return await this.projectsService.findById(params.id);
    }

    @ApiOperation({ summary: "Получить проект с вложениями" })
    @ApiResponse({ status: 200, type: ProjectEntity })
    @ApiParam({ name: 'id', required: true })
    @UseGuards(ProjectAuthGuard)
    @Get('/complete/:id')
    @ApiBearerAuth('JWT-auth')
    async getCompleteProject(@Param() params) {
        // console.log(params.id)
        return await this.projectsService.getCompleteProject(params.id);
    }


}
