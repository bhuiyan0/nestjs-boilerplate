import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'modules/user/dto/user.dto';
import { User } from 'modules/user/entities/user.entity';
import { UtilsProvider } from 'providers/utils.provider';
import { ApiConfigService } from 'shared/services/api-config.service';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { UserLoginDto } from './dto/UserLoginDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
    private readonly userService: UserService,
  ) {}

  get dev(): boolean {
    return process.env.NODE_ENV !== 'production';
  }

  async createToken(user: User | UserDto): Promise<TokenPayloadDto> {
	  let payload:any = {
		  id: user.id
		}
	  	  
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync(payload),
    });
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<User> {
    const user = await this.userService.findUser(userLoginDto);
    const isPasswordValid = await UtilsProvider.validateHash(userLoginDto.password,user?.password);
	
    if (!user) {
      throw new NotFoundException('User not found');
    }
	if(!isPasswordValid) {
		throw new BadRequestException('wrong password')
	}
	delete user.password;
    return user;
  }
  
  

}
