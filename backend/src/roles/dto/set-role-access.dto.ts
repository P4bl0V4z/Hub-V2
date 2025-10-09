import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';
import { NivelAcceso } from '@prisma/client'; // usamos tu enum real del schema

export class RoleAccessEntryDto {
  @IsString()
  objectKey!: string; // key de ObjetoSistema

  @IsEnum(NivelAcceso)
  nivel!: NivelAcceso; // 'SIN_DEFINIR' | 'SIN_ACCESO' | 'VER' | 'EDITAR'
}

export class SetRoleAccessDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleAccessEntryDto)
  entries!: RoleAccessEntryDto[];
}
