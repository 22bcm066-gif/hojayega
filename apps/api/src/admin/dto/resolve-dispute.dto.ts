import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

const RESOLUTIONS = [
  'RESOLVED_CUSTOMER',
  'RESOLVED_HELPER',
  'RESOLVED_SPLIT',
  'CLOSED',
] as const;

export class ResolveDisputeDto {
  @ApiProperty({ enum: RESOLUTIONS })
  @IsIn(RESOLUTIONS)
  status!: (typeof RESOLUTIONS)[number];

  @ApiProperty()
  @IsString()
  resolutionNote!: string;

  @ApiProperty({
    required: false,
    description:
      'Amount refunded to the customer, required for RESOLVED_CUSTOMER/RESOLVED_SPLIT',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  refundAmount?: number;
}
