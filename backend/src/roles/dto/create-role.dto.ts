import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString() nombre!: string;
  @IsOptional() @IsString() descripcion?: string;
  @IsBoolean() soloEmpresaMaestra!: boolean; // true: solo maestra, false: global
}
