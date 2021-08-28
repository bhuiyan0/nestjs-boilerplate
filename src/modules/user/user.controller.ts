import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiTag } from 'common/constants/api-tag';
import { AuthUser } from 'decorators/auth-user.decorator';
import { AuthGuard } from 'guards/auth.guard';
import { RedisCacheService } from 'shared/services/redis-cache.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserCreateDto, UserUpdateDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
		private readonly cacheService: RedisCacheService
		) { }

	
	@Get(':id')
	@ApiParam({ name: 'id', type: 'string', required: false })
	@ApiOperation({ tags: [ApiTag.USER], summary: 'get all users or get one user by id' })
	@HttpCode(HttpStatus.OK)
	async getUser(@Param('id') id?: string) {
		return await this.userService.getUser(+id);
	}

	@Post()
	@ApiOperation({ tags: [ApiTag.USER], summary: 'create new user' })
	@HttpCode(HttpStatus.OK)
	async create(@Body() body: UserCreateDto) {
		return this.userService.create(body);
	}

	@Post('update')
	@ApiOperation({ tags: [ApiTag.USER], summary: 'update user' })
	@HttpCode(HttpStatus.OK)
	@ApiBearerAuth()
	@UseGuards(AuthGuard)
	async update(@AuthUser() user: User, @Body() body: UserUpdateDto) {
		console.log('user update auth user', user);
		
		return this.userService.update(+user.id,body);
	}
	
	@Put('changePassword')
	@ApiBearerAuth()
	@ApiOperation({ tags: [ApiTag.USER], summary: 'user password change' })
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthGuard)
	async changePassword(@AuthUser() user:User, @Body() body: ChangePasswordDto) {
		return this.userService.changePassword(+user.id,body);
	}
	
}
