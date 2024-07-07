import { TypeOrmModule } from './datasource/typeorm.module';
import { Module } from "@nestjs/common";
// import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { ProjectsModule } from "./projects/projects.module";
import { ListsModule } from "./lists/lists.module";
import { TasksModule } from "./tasks/tasks.module";

import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    UsersModule,
    ProjectsModule,
    AuthModule,
    ListsModule, 
    TasksModule, 
    TypeOrmModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
  ],
})
export class AppModule {}
