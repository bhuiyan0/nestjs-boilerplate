import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const hasPermissions = (permission: number) =>
  SetMetadata(PERMISSIONS_KEY, permission);
