import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class AddDisputeMessageDto {
  @ApiProperty()
  @IsString()
  @MaxLength(2000)
  content!: string;
}
