import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional() @IsString() nombre?: string;
  @IsOptional() @IsString() descripcion?: string;
  @IsOptional() @IsBoolean() soloEmpresaMaestra?: boolean;
}
