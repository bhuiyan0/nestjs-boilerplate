import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsString()
  @ApiProperty()
  readonly password?: string;
}
