import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

const KYC_DOC_TYPES = [
  'AADHAAR_FRONT',
  'AADHAAR_BACK',
  'PAN',
  'SELFIE_LIVENESS',
  'BANK_PROOF',
  'POLICE_VERIFICATION',
] as const;

export class SubmitKycDocumentDto {
  @ApiProperty({ enum: KYC_DOC_TYPES })
  @IsIn(KYC_DOC_TYPES)
  type!: (typeof KYC_DOC_TYPES)[number];

  @ApiProperty({
    description:
      'URL of the file already uploaded to object storage (S3 pre-signed upload happens client-side)',
  })
  @IsString()
  fileUrl!: string;
}
