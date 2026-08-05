import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateTaskStatusDto {
  @ApiProperty({ enum: ['HELPER_EN_ROUTE', 'IN_PROGRESS'] })
  @IsIn(['HELPER_EN_ROUTE', 'IN_PROGRESS'])
  status!: 'HELPER_EN_ROUTE' | 'IN_PROGRESS';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
