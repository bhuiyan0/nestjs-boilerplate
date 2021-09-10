import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsOptional, IsEmail, IsString, IsNumber, IsNotEmpty, IsMobilePhone, MinLength, ValidateIf } from 'class-validator';
import { AbstractDto } from 'common/dto/abstract.dto';
import { Trim, TrimPhoneNumber } from 'decorators/transforms.decorator';
import { Role } from 'modules/role/entities/role.entity';
import { Match } from 'validators/match.decorator';

export class UserDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  userName?: string;

  @ApiPropertyOptional()
  role: Role;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  phone: string;

}


export class UserCreateDto {
	@ApiPropertyOptional()
	@IsOptional()
	name: string;

	@ApiPropertyOptional()
	@IsOptional()
	userName?: string;

	@ApiProperty()
	@ValidateIf((obj,value)=>obj.hasOwnProperty('email') )
	@IsNotEmpty({ message: 'Please enter a email address'})
	@IsEmail({})
	@Trim()
	email: string;
  
  
	@ApiProperty()
	@ValidateIf((obj,value)=>obj.hasOwnProperty('phone') )
	@IsMobilePhone('bn-BD',null,{ message: 'Please enter a valid bangladeshi phone number'})
	@IsNotEmpty()
	@TrimPhoneNumber()
	@Trim()
	phone: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'Please enter a password' })
	@MinLength(6)
	password: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'Please enter a confirm password' })
	@Match('password', { message: 'Password and confirm password do not match' })
	confirmPassword: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber()
	roleId:number;

	@Exclude()
	role?: Role;
}


export class UserUpdateDto {
	@IsOptional()
	@ApiPropertyOptional()
	name?: string;

	@ApiPropertyOptional()
	@IsOptional()
	username?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsEmail({})
	@Trim()
	email?: string;
  
	@ApiPropertyOptional()
	@IsOptional()
	@IsMobilePhone('bn-BD',null,{ message: 'Please enter a valid bangladeshi phone number'})
	@TrimPhoneNumber()
	@Trim()
	phone?: string;
  
	@ApiPropertyOptional()
	@IsOptional()
	@IsNumber()
	roleId?:number;

	@Exclude()
	role?: Role;

}
