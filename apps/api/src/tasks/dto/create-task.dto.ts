import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ description: 'TaskCategory slug', example: 'grocery-pickup' })
  @IsString()
  categorySlug!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(120)
  title!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(2000)
  description!: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  photos?: string[];

  @ApiProperty({ description: 'Amount the customer is offering, in INR' })
  @IsNumber()
  @IsPositive()
  priceOffered!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pickupAddressId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dropAddressId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  siteAddressId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  scheduledFor?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean;

  @ApiProperty({ required: false, description: 'Promo code to apply' })
  @IsOptional()
  @IsString()
  promoCode?: string;
}
