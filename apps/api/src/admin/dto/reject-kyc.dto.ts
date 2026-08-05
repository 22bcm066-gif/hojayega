import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RejectKycDto {
  @ApiProperty()
  @IsString()
  reason!: string;
}
