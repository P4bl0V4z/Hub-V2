import { IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SetRoleUsersDto {
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  userIds!: number[]; // IDs de Usuario (no UsuarioEmpresa)
}
