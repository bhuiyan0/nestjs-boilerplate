import { IsNotEmpty, IsOptional } from 'class-validator';

export class PermissionCreateDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  group?: string;
}
