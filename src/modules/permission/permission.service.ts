import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PermissionCreateDto } from './dto/permission-create.dto';
import { Permission } from './entities/permission.entity';
import { PermissionRepository } from './permission.repository';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepo: PermissionRepository) {}

  async create(permission: PermissionCreateDto) {
    const isExist = await this.findOneByName(permission?.name);
    if (isExist) {
      throw new HttpException(
        'this permission is already exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.permissionRepo.save(permission);
  }

  async findOneByName(name: string): Promise<Permission> {
    return await this.permissionRepo.findOne({ name: name });
  }

}
