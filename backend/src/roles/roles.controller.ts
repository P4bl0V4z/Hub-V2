// backend/src/roles/roles.controller.ts
import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req, SetMetadata, UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SetRoleUsersDto } from './dto/set-role-users.dto';
import { SetRoleAccessDto } from './dto/set-role-access.dto';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie.guard';
import { AuthzGuard } from '../authz/authz.guard';
import { AUTHZ_MIN, AUTHZ_OBJECT } from '../authz/authz.decorator';

type ReqWithCtx = Request & { empresaId?: number };

@UseGuards(JwtCookieAuthGuard, AuthzGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @SetMetadata(AUTHZ_OBJECT, 'roles')
  @SetMetadata(AUTHZ_MIN, 'VER')
  @Get()
  list(@Req() req: ReqWithCtx) {
    return this.service.findMany(req.empresaId!);
  }

  @SetMetadata(AUTHZ_OBJECT, 'roles')
  @SetMetadata(AUTHZ_MIN, 'EDITAR')
  @Post()
  create(@Req() req: ReqWithCtx, @Body() dto: CreateRoleDto) {
    return this.service.create(req.empresaId!, dto);
  }

  @SetMetadata(AUTHZ_OBJECT, 'roles')
  @SetMetadata(AUTHZ_MIN, 'VER')
  @Get(':id')
  detail(@Req() req: ReqWithCtx, @Param('id', ParseIntPipe) id: number) {
    return this.service.findById(req.empresaId!, id);
  }

  @SetMetadata(AUTHZ_OBJECT, 'roles')
  @SetMetadata(AUTHZ_MIN, 'EDITAR')
  @Patch(':id')
  update(@Req() req: ReqWithCtx, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.service.update(req.empresaId!, id, dto);
  }

  @SetMetadata(AUTHZ_OBJECT, 'roles')
  @SetMetadata(AUTHZ_MIN, 'EDITAR')
  @Delete(':id')
  remove(@Req() req: ReqWithCtx, @Param('id', ParseIntPipe) id: number) {
    return this.service.remove(req.empresaId!, id);
  }

  // NUEVO: reemplazo de accesos (nivel por ObjetoSistema)
  @SetMetadata(AUTHZ_OBJECT, 'roles')
  @SetMetadata(AUTHZ_MIN, 'EDITAR')
  @Put(':id/access')
  replaceAccess(@Req() req: ReqWithCtx, @Param('id', ParseIntPipe) id: number, @Body() dto: SetRoleAccessDto) {
    return this.service.replaceAccess(req.empresaId!, id, dto.entries as any);
  }

  @SetMetadata(AUTHZ_OBJECT, 'roles')
  @SetMetadata(AUTHZ_MIN, 'EDITAR')
  @Put(':id/users')
  replaceUsers(@Req() req: ReqWithCtx, @Param('id', ParseIntPipe) id: number, @Body() dto: SetRoleUsersDto) {
    return this.service.replaceUsers(req.empresaId!, id, dto.userIds);
  }
}
