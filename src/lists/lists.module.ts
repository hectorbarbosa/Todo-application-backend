import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { ListEntity } from './lists.entity';
import { ProjectEntity } from 'src/projects/projects.entity';
import { ProjectsModule } from 'src/projects/projects.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProjectsService } from 'src/projects/projects.service';

@Module({
  imports: [
    AuthModule,
    ProjectsModule, 
    TypeOrmModule.forFeature(
        [
          ListEntity, 
          ProjectEntity,
        ]), 
  ],
  providers: [ListsService, ProjectsService],
  controllers: [ListsController]
})
export class ListsModule {}
