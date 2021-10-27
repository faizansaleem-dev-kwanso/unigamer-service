import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly firstname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly lastname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly picture: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly company: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly street: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly city: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly zip: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly state: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly country: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly telephone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly description: string;
}
