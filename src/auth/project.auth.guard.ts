import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { jwtConstants } from './constants';
import { Request } from 'express';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class ProjectAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService, 
    private projectService: ProjectsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verify(
        token,
        {
        //   secret: jwtConstants.secret
            secret: process.env.PRIVATE_KEY
        }
      );
      const projectId = request.params.id;
      const userId = payload.id;
      // console.log(projectId, payload);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      const validUser = await this.projectService.isValidProjectUser(projectId, userId);
      if (!validUser) {
        return false;
      }
      request['user'] = payload;
    } catch(error) {
      console.log(error)
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, access_token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? access_token : undefined;
  }
}
