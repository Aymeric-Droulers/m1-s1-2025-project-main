import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsUrl()
  pictureUrl?: string;
}

export class UpdateAuthorDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsUrl()
  pictureUrl?: string;
}