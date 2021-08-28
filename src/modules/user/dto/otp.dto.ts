import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { AbstractDto } from 'common/dto/abstract.dto';

export class OtpUpdateDto extends AbstractDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	user: string;

	@Exclude()
	code: number;
}

