import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsInt, Min, Max, IsString, IsNotEmpty } from 'class-validator';


import { Order } from '../constants/order';

export class PageOptionsDto {
  @ApiPropertyOptional({ minimum: 1,default: 1})
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({minimum: 1, maximum: 100,default: 50})
  @Type(() => Number)
  @IsInt()
  @Min(2)
  @Max(50)
  @IsOptional()
  readonly take: number = 50;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

}
