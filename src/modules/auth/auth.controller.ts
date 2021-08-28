import { Body,Controller, Get, HttpCode,HttpException, HttpStatus,Post,UseGuards} from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from 'decorators/auth-user.decorator';
import { AuthGuard } from 'guards/auth.guard';
import {  UserCreateDto, UserDto } from 'modules/user/dto/user.dto';
import { User } from 'modules/user/entities/user.entity';
import { UserService } from 'modules/user/user.service';
import { AuthService } from './auth.service';
import CustomerLoginDto from './dto/CustomerLogin.dto';

import { LoginPayloadDto } from './dto/LoginPayloadDto';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';
@Controller('auth')
export class AuthController {
  constructor(
    public readonly userService: UserService,
    public readonly authService: AuthService,
  ) {}

  // user login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({tags:['Auth'],summary:'Admin Login with phone/email/username and password'})
  async userLogin(@Body() userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.validateUser(userLoginDto);

    const token = await this.authService.createToken(userEntity);
    return new LoginPayloadDto(userEntity, token);
  }

  // register new user 
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({tags:['Auth'],summary:'Register with phone/email/username and password'})
  async userRegister(@Body() userRegisterDto: UserCreateDto): Promise<User> {
    return await this.userService.create(userRegisterDto);
  }

  // get current user
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({tags:['Auth'],summary:'Get the current user from the bearer token'})
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getCurrentUser(@AuthUser() user: User): UserDto {
    return user;
  }

}
