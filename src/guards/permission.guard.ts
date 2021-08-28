import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'decorators/permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<number>(
      PERMISSIONS_KEY,
      context.getHandler(),
    );
    if (!requiredPermission) {
      return true;
    }
    // const request = context.switchToHttp().getRequest();
    // console.log("reqPermissionId ===== ",requiredPermission);
    // // console.log("req ==== ",request);
    // const { user } = request;
    // const authUser = user?.user;

    // console.log('user in guard',authUser);

    // const allUserPermissions = await this.userService.findUserAllPermissions(authUser?.id);
    // console.log('permissions in guard',allUserPermissions);
    // const flag = await allUserPermissions.some((p) => p = requiredPermission);
    // console.log({flag})

    // return flag;
  }
}
