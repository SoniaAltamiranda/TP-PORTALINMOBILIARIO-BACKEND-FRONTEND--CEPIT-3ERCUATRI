import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Property } from './property.interface';
import { PropertyDto } from './property.dto';

const BASE_URL = 'http://localhost:3030/properties/';
@Injectable()
export class PropertyService {


  async getProperties(): Promise<Property[]> {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new BadRequestException()
      const parsed = await res.json();
      return parsed;
    }
    catch (error) {
      throw new BadRequestException()
    }
  }

  async getByLocation(location: string): Promise<Property[]> {
    try {
      const allProperties = await this.getProperties();
      const filtByLocation = allProperties.filter((properties) =>
        properties.location.toLocaleLowerCase().includes(location.toLocaleLowerCase()));
      if (!filtByLocation.length) throw new NotFoundException(`Sin propiedades en alquiler en ${location}.`)
      return filtByLocation;
    }
    catch (error) {
      throw new NotFoundException(`Sin propiedades en ${location}`);
    };
  }

  async getPropertyById(id: number): Promise<Property> {
    try {
      const res = await fetch(BASE_URL + id);
      if (!res.ok) throw new BadRequestException();
      const parsed = await res.json();
      if (Object.keys(parsed).length) return parsed;
    }
    catch (error) {
      throw new NotFoundException(`La propiedad con el ID:${id}, no existe.`)
    }
  }

  private async setId(): Promise<number> {
    const properties = await this.getProperties();
    const id = properties.pop().id + 1;
    return id;
  }

  async postProperty(property: PropertyDto): Promise<Property> {
    console.log(property)

    try {
      const id = await this.setId();
      const { title, type, location, rooms, description, price, images } = property;
      const newProperty = { id, title, type, location, rooms, description, price, images };
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProperty),
      });
      if (!res.ok) throw new BadRequestException();
      const parsed = res.json();
      return parsed;
    }
    catch (error) {
      throw new BadRequestException(`No se pudo cargar la propiedad.`)
    }
  }

  async deleteProperty(id: number) {
    try {
      const res = await fetch(BASE_URL + id, {
        method: 'DELETE',
      });
      if (!res.ok) throw new BadRequestException(`La Propiedad con el ID:${id}, no existe.`);
      return JSON.stringify({
        message: `Se ha eliminado la propiedad correctamente.`
      });
    }
    catch (error) {
      throw new BadRequestException(`La Propiedad con el ID:${id}, no existe.`);
    }
  }

  async modifyPropertyById(id: number, propertyDto: PropertyDto): Promise<any> {
    try {
      const isProperty = await this.getPropertyById(id);
      if (!isProperty) {
        throw new NotFoundException(`La propiedad con el ID: ${id} no existe`)
      }
      const modifiedProperty = { id, ...propertyDto };
      console.log(modifiedProperty)
      const res = await fetch(BASE_URL + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifiedProperty),
      });
      if (res.ok) {
        return JSON.stringify({
          message: `La propiedad con el ID:${id} se ha modificado correctamente`
        });
      }
    }
    catch (error) {
      throw new BadRequestException(`La propiedad con el ID: ${id} no existe.`)
    }
  }
}
