import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskEntity } from './tasks.entity';
import { ListEntity } from 'src/lists/lists.entity';
import { ListsModule } from 'src/lists/lists.module';
import { AuthModule } from 'src/auth/auth.module';
import { ListsService } from 'src/lists/lists.service';

@Module({
    imports:[
      AuthModule,
      ListsModule,
      TypeOrmModule.forFeature(
      [
          TaskEntity, 
          ListEntity,
      ]),
    ],
  providers: [TasksService, ListsService],
  controllers: [TasksController]
})
export class TasksModule {}
