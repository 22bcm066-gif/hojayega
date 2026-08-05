import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsLatitude, IsLongitude, IsOptional } from 'class-validator';

export class UpdateAvailabilityDto {
  @ApiProperty({ enum: ['ONLINE', 'OFFLINE', 'BUSY'] })
  @IsIn(['ONLINE', 'OFFLINE', 'BUSY'])
  availability!: 'ONLINE' | 'OFFLINE' | 'BUSY';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsLatitude()
  lat?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsLongitude()
  lng?: number;
}
