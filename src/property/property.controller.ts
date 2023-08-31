import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
  HttpCode,
  Res,
  HttpStatus,
} from '@nestjs/common';

import { PropertyService } from './property.service';
import { Property } from './property.interface';

@Controller('/properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}
  
  @Get()
  getImmovables(): Promise<Property[]> {
    return this.propertyService.getImmovables();
  }
  
  @Get('/:id')
  async getPropertyById(
    @Res() response,
    @Param('id') id: number,
  ): Promise<Property> {
    const property = await this.propertyService.getPropertyById(id);
    if (!property.id) {
      return response.status(HttpStatus.NOT_FOUND).json({
        error: `La propiedad con el ID:${id} no existe.`,
      });
    } else {
      return response.status(HttpStatus.OK).json(property);
    }
  }
 
  @Post()
  async postProperty(@Res() response, @Body() body): Promise<any> {
    const resFromServ = await this.propertyService.postProperty(body);
    if (Object.keys(resFromServ).length) {
      return response.status(HttpStatus.CREATED).json({
        message: 'El inmueble se ha cargado correctamente.',
      });
    } else {
      return response.status(HttpStatus.BAD_REQUEST).json({
        error: `La solicitud no se pudo procesar, el formato es incorrecto`,
      });
    }
  }
 
  @Delete('/:id')
  async deleteProperty(
    @Res() response,
    @Param('id') id: number,
  ): Promise<void> {
    let propertyToDelete = await this.propertyService.getPropertyById(id);
    if (!Object.keys(propertyToDelete).length) {
      return response.status(HttpStatus.NOT_FOUND).json({
        error: `El inmueble con el ID:${id} no existe.`,
      });
    } else {
      propertyToDelete = await this.propertyService.deleteProperty(id);
      return response.status(HttpStatus.OK).json({
        message: `El inmuble se ha elminado correctamente`,
      });
    }
  }
  
  @Put('/:id')
  @HttpCode(204)
  modifyInmueble(@Param('id') id: number, @Body() body): Promise<void> {
    return this.propertyService.modifyPropertyById(id, body);
  }
}