import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { User } from 'modules/user/entities/user.entity';
import { Observable } from 'rxjs';

@Injectable()
export class CreateInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const user = <User>request.user;
		const body = request?.body;
		if(body && user){
			body.createdBy = user.id;
		}
		return next.handle();
	}
}