import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, Max } from 'class-validator';


export class PageOptionsDto {
  @ApiPropertyOptional({ minimum: 1,default: 1})
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({minimum: 1, maximum: 100,default: 50})
  @Type(() => Number)
  @IsInt()
  @Min(2)
  @Max(50)
  @IsOptional()
  take: number = 50;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

}
