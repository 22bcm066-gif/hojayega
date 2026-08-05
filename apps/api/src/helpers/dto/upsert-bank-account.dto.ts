import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpsertBankAccountDto {
  @ApiProperty()
  @IsString()
  accountHolderName!: string;

  @ApiProperty({
    description:
      'Full account number — only the last 4 digits are persisted, masked',
  })
  @IsString()
  accountNumber!: string;

  @ApiProperty()
  @IsString()
  ifsc!: string;

  @ApiProperty()
  @IsString()
  bankName!: string;
}
