import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef( () => UsersModule),
    forwardRef( () => ProjectsModule),
    JwtModule.register({
        global: true,
        secret: process.env.PRIVATE_KEY,
        signOptions: {
          expiresIn: '24h',
        }
    })
  ],
  exports: [
    AuthService,
    JwtModule
  ],
})
export class AuthModule {}
