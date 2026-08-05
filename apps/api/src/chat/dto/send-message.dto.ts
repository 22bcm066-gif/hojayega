import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ enum: ['TEXT', 'IMAGE', 'VOICE_NOTE'], default: 'TEXT' })
  @IsOptional()
  @IsIn(['TEXT', 'IMAGE', 'VOICE_NOTE'])
  type?: 'TEXT' | 'IMAGE' | 'VOICE_NOTE';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  content?: string;

  @ApiProperty({
    required: false,
    description: 'URL for IMAGE/VOICE_NOTE messages',
  })
  @IsOptional()
  @IsString()
  mediaUrl?: string;
}
