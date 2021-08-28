import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsString, MinLength } from 'class-validator';

export default class CustomerLoginDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'invalid email' })
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(11, {
    message: 'invalid phone number,phone number must be at least 11 characters',
  })
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'password must be at least 6 characters' })
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'confirm password must be at least 6 characters' })
  confirmPassword: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  otp: string;
}
