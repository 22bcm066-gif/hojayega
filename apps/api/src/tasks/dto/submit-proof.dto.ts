import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class SubmitProofDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  photos!: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description:
      'Completion OTP the customer shares with the helper in person/app',
  })
  @IsString()
  @Length(6, 6)
  otp!: string;
}
