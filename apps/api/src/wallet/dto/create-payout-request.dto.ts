import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreatePayoutRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount!: number;
}
