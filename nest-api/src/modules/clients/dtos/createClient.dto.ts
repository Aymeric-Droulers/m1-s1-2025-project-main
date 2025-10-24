import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;
  @IsEmail()
  @IsOptional()
  mail: string;
  @IsString()
  @IsOptional()
  photo_link: string;
}
