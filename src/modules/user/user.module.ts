import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from 'modules/role/role.module';
import { AuthService } from '../auth/auth.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';
import { OtpRepository } from './repositories/otp.repository';
import { OtpService } from './otp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, OtpRepository]),
    RoleModule
  ],
  controllers: [UserController],
  providers: [UserService, OtpService],
  exports: [UserService, OtpService],
})
export class UserModule {}
