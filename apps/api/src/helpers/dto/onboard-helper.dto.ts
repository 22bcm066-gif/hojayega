import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class OnboardHelperDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ type: [String], example: ['electrician', 'plumbing'] })
  @IsArray()
  skills!: string[];

  @ApiProperty({ type: [String], example: ['en', 'gu', 'hi'] })
  @IsArray()
  languages!: string[];

  @ApiProperty({
    type: [String],
    description: 'Task category slugs the helper wants to serve',
  })
  @IsArray()
  @ArrayNotEmpty()
  categorySlugs!: string[];
}
