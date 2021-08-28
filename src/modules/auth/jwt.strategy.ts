import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ApiConfigService,
    public readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.jwtSecret,
    });
  }

  async validate({ iat, exp, id: userId }) {	  
    const timeDiff = exp - iat;
	
    if (timeDiff <= 0) {
      throw new UnauthorizedException();
    }
	console.log('user id in jwt',userId);
	
    const user = await this.userService.findForJwt(+userId);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
