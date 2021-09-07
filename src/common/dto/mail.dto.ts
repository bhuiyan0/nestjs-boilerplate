import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsEmail } from "class-validator";

export class MailDto{
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	subject: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	body: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsEmail()
	to: string;
}