import { Controller, Post , Get, Put, Delete, Body, Param, UseGuards, Req, UnauthorizedException} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectEntity } from './projects.entity';
import { UserEntity } from 'src/users/users.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProjectAuthGuard } from 'src/auth/project.auth.guard';

@ApiTags('Проекты')
@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) {}

    @ApiOperation({ summary: "Добавить проект" })
    @ApiResponse({ status: 201, type: ProjectEntity })
    @UseGuards(AuthGuard)
    @ApiParam({ name: 'id', required: true })
    @Post('/:id')
    @ApiBearerAuth('JWT-auth')
    async create(@Param() params, @Body() projectDto: CreateProjectDto) {
        return await this.projectsService.createProject(params.id, projectDto);
    }

    @ApiOperation({ summary: "Получить все проекты пользователя" })
    @ApiResponse({ status: 200, type: [ProjectEntity] })
    @UseGuards(AuthGuard)
    @Get('/all/:id')
    @ApiBearerAuth('JWT-auth')
    async getAll(@Param() params) {
        return await this.projectsService.findAll(params.id);
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
    @UseGuards(ProjectAuthGuard)
    @Get('/complete/:id')
    @ApiBearerAuth('JWT-auth')
    async getCompleteProject(@Param() params) {
        // console.log(params.id)
        return await this.projectsService.getCompleteProject(params.id);
    }


}
