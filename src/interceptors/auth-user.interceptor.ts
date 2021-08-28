import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { User } from 'modules/user/entities/user.entity';

import { ContextProvider } from '../providers/context.provider';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const user = <User>request.user;
	// console.log('user: ' + JSON.stringify(user));
	
    ContextProvider.setAuthUser(user);

    return next.handle();
  }
}
