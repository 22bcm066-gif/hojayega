import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class SetCommissionDto {
  @ApiProperty({
    required: false,
    description: 'TaskCategory id; omit for the platform-wide default',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ minimum: 0, maximum: 50 })
  @IsNumber()
  @Min(0)
  @Max(50)
  commissionPercent!: number;
}
