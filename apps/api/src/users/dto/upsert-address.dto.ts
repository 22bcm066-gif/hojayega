import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpsertAddressDto {
  @ApiProperty({ example: 'Home' })
  @IsString()
  label!: string;

  @ApiProperty()
  @IsString()
  line1!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  line2?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiProperty({ default: 'Ahmedabad' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ default: 'Gujarat' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty()
  @IsString()
  pincode!: string;

  @ApiProperty()
  @IsLatitude()
  lat!: number;

  @ApiProperty()
  @IsLongitude()
  lng!: number;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
