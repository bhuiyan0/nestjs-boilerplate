import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractEntity } from 'common/abstract.entity';

export class AbstractDto {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;

  @ApiProperty()
  createdBy?: number;

  @ApiProperty()
  updatedBy?: number;

  @ApiPropertyOptional()
  status?: boolean;
}
