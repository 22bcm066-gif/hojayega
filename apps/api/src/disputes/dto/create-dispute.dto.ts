import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const REASONS = [
  'TASK_NOT_COMPLETED',
  'POOR_QUALITY',
  'OVERCHARGED',
  'HELPER_NO_SHOW',
  'CUSTOMER_UNRESPONSIVE',
  'PAYMENT_ISSUE',
  'SAFETY_CONCERN',
  'OTHER',
] as const;

export class CreateDisputeDto {
  @ApiProperty({ enum: REASONS })
  @IsIn(REASONS)
  reason!: (typeof REASONS)[number];

  @ApiProperty()
  @IsString()
  @MaxLength(2000)
  description!: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  evidencePhotos?: string[];
}
