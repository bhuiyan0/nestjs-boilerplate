import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsNotEmpty, IsPhoneNumber, Length, MinLength, ValidateIf, IsMobilePhone } from 'class-validator';
import { Trim, TrimPhoneNumber } from 'decorators/transforms.decorator';
import { Column } from 'typeorm';

export class UserRegisterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Trim()
  readonly name: string;


  @ApiProperty()
  @ValidateIf((obj,value)=>!obj.phone)
  @IsString()
  @IsNotEmpty({ message: 'Please enter a email address'})
  @IsEmail({})
  @Trim()
  readonly email: string;


  @ApiProperty()
  @ValidateIf((obj,value)=>!obj.email)
  @IsMobilePhone('bn-BD',null,{ message: 'Please enter a valid bangladeshi phone number'})
  @IsNotEmpty()
  @TrimPhoneNumber()
  @Trim()
  phone: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  readonly password: string;
}
