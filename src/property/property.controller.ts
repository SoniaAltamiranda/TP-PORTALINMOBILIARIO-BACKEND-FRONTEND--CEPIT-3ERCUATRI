import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
  HttpStatus,
  ParseIntPipe,
  Query,
  HttpCode
} from '@nestjs/common';

import { PropertyService } from './property.service';
import { Property } from './property.interface';
import { PropertyDto } from './property.dto';

@Controller('/properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) { }

  @Get()
  getProperties(@Query('location') location?: string): Promise<Property[]> {
    if(!location) return this.propertyService.getProperties();
    return this.propertyService.getByLocation(location);
  }

  @Get('/:id')
  async getPropertyById(
    @Param('id', new ParseIntPipe({
      errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number): Promise<Property> {
    return this.propertyService.getPropertyById(id);
  }

  @Post()
  async postProperty(@Body() propertyDto: PropertyDto): Promise<any> {
    return this.propertyService.postProperty(propertyDto);
  }

  @Delete('/:id')
  async deleteProperty(
    @Param('id', new ParseIntPipe({
      errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number
  ): Promise<any> {
      return this.propertyService.deleteProperty(id)
  }

  @Put('/:id')
  modifyInmueble(@Param('id', new ParseIntPipe({
    errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
  })) id: number, @Body() propertyDto : PropertyDto): Promise<void> {
    return this.propertyService.modifyPropertyById(id, propertyDto);
  }
}
