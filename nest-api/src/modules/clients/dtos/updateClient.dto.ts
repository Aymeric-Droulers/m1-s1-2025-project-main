import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  first_name: string;
  @IsString()
  @IsOptional()
  last_name: string;
  @IsEmail()
  @IsOptional()
  mail: string;
  @IsString()
  @IsOptional()
  photo_link: string;
}
