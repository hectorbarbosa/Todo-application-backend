import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectEntity } from './projects.entity';
import { UserEntity } from 'src/users/users.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef( ()=> AuthModule),
    TypeOrmModule.forFeature(
    [
      ProjectEntity, 
      UserEntity,
    ]), 
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController]
})
export class ProjectsModule {}
