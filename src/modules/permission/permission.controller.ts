import { Body, Controller, Post } from '@nestjs/common';
import { PermissionCreateDto } from './dto/permission-create.dto';
import { PermissionService } from './permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  @Post()
  async create(@Body() permission: PermissionCreateDto) {
    return await this.permissionService.create(permission);
  }
}
