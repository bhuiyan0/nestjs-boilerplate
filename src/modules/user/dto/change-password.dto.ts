import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";
import { Match } from "validators/match.decorator";

export class ChangePasswordDto{
	@ApiProperty()
	@IsNotEmpty({ message: 'Please enter your old password' })
	currentPassword: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'Please enter a password' })
	@MinLength(6)
	password: string;

	@ApiProperty()
	@IsNotEmpty({ message: 'Please enter a confirm password' })
	@Match('password', { message: 'Password and confirm password do not match' })
	confirmPassword: string;
}