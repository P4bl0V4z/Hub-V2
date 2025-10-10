import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie.guard';
import { AuthzGuard } from '../authz/authz.guard';
import { AUTHZ_MIN, AUTHZ_OBJECT } from '../authz/authz.decorator';
import { CreateObjetoDto } from './dto/create-objeto.dto';
import { UpdateObjetoDto } from './dto/update-objeto.dto';

@UseGuards(JwtCookieAuthGuard, AuthzGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @SetMetadata(AUTHZ_OBJECT, 'objetos')  // ⬅️ clave correcta del ObjetoSistema
  @SetMetadata(AUTHZ_MIN, 'VER')
  @Get()
  list() {
    return this.service.findAll();
  }

  @SetMetadata(AUTHZ_OBJECT, 'objetos')
  @SetMetadata(AUTHZ_MIN, 'EDITAR')
  @Post()
  create(@Body() dto: CreateObjetoDto) {
    return this.service.create(dto);
  }

  @SetMetadata(AUTHZ_OBJECT, 'objetos')
  @SetMetadata(AUTHZ_MIN, 'EDITAR')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateObjetoDto) {
    return this.service.update(id, dto);
  }

  @SetMetadata(AUTHZ_OBJECT, 'objetos')
  @SetMetadata(AUTHZ_MIN, 'EDITAR')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
