import { IsOptional, IsString, IsObject } from 'class-validator';

export class CreateAttemptDto {
  @IsOptional() 
  @IsString()
  label?: string;

  @IsOptional() 
  @IsObject()
  initialProgress?: Record<string, any>;
}