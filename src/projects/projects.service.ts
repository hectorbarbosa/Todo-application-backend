import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './projects.entity';
import { CreateProjectDto } from './dto/create-project.dto'
import { UpdateProjectDto } from './dto/update-project.dto'
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from '../users/users.entity';

@Injectable()
export class ProjectsService {
    private projectRepository;
    private userRepository;

    constructor(
        private dataSource: DataSource
) {
    this.projectRepository = this.dataSource.getRepository(ProjectEntity);
    this.userRepository = this.dataSource.getRepository(UserEntity);
}

    async createProject(userId: number, dto: CreateProjectDto) {
        // console.log(dto);
        const {title, description} = dto;
        let newProject = new ProjectEntity();
        newProject.title = title;
        if (description) {
            newProject.description = description;
        }

        try {
            const savedProject = await this.projectRepository.save(newProject);

            await this.dataSource
                .createQueryBuilder()
                .relation(ProjectEntity, "user")
                .of(savedProject.id)
                .set(userId);
        
            return savedProject;
        } catch(error) {
            console.log(error.message);
            throw new HttpException('error creating new project', HttpStatus.BAD_REQUEST);
        }
    }

    async findAll(userId: number): Promise<ProjectEntity[]> {
        const projects = await this.projectRepository
            .createQueryBuilder('project')
            .where("project.userId = :id", {id: userId})
            .getMany();
        return projects;
    }

    async updateProject(projectId: number, dto: UpdateProjectDto): Promise<ProjectEntity> {
        let toUpdate = await this.projectRepository.findOneBy({ id: projectId });
        if (!toUpdate) {
            throw new HttpException('project not found', HttpStatus.NOT_FOUND);
        } 

        try {
            let updated = Object.assign(toUpdate, dto);
            return await this.projectRepository.save(updated);
        } catch(error) {
            console.log(error.message);
            throw new HttpException('error updating project', HttpStatus.BAD_REQUEST);
        }
    }

    async deleteProject(projectId: number): Promise<boolean> {
        let exists = await this.projectRepository.exists({ 
            where: {id: projectId },
        });
        if (!exists) {
            throw new HttpException('project not found', HttpStatus.NOT_FOUND);
        } 

        try {
            const result = await this.projectRepository.delete(projectId);
            if (!result) {
                return false;
            } 
            return true;
        } catch(error) {
            console.log(error.message);
            throw new HttpException('error deleting project', HttpStatus.BAD_REQUEST);
        }
    }

    async findById(projectId: number): Promise<ProjectEntity> {
        let project = await this.projectRepository.findOneBy({ id: projectId });
        if (!project) {
            throw new HttpException('project not found', HttpStatus.BAD_REQUEST);
        } 
        return project;
    }
    
    async getCompleteProject(projectId: number) {
        const project = await this.projectRepository
            .createQueryBuilder('project')
            .leftJoinAndSelect(
                'project.ls', 'lists' 
            )
            .leftJoinAndSelect(
                'lists.ts', 'tasks'
            )
            .where("project.id = :id", { id: projectId })
            .getOne();
            // console.log(project);

        if (!project) {
            throw new HttpException('project not found', HttpStatus.NOT_FOUND);
        } 

        return project;
    }

    async isValidProjectUser(projectId: number, userId: number) {
        try {
            const { count } = await this.projectRepository
                .createQueryBuilder('project')
                .select("COUNT(project.id)", "count")
                .where('project."userId" = :userId', { userId })
                .andWhere('project.id = :projectId', { projectId })
                .getRawOne();
            
            // console.log(count, userId, projectId);
            return count > 0 ? true : false;
        }
        catch(error) {
            console.log(error)
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
