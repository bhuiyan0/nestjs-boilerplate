import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { RoleCreateDto } from './dto/role-create.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  async create(@Body() role: RoleCreateDto) {
    return await this.roleService.create(role);
  }

  @Get()
  async getRoles() {
    return await this.roleService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.roleService.getById(id);
  }
}
