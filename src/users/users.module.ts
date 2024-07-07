import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserEntity } from './users.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef( ()=> AuthModule),
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [
    UsersService,
  ]
})
export class UsersModule {}
