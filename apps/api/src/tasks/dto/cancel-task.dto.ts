import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelTaskDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
