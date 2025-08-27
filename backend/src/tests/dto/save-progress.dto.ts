import { IsObject } from 'class-validator';

export class SaveProgressDto {
  @IsObject()
  progress!: Record<string, any>;
}