import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Property } from './property.interface';
import { PropertyDto } from './property.dto';

const BASE_URL = 'http://localhost:3030/properties/';
@Injectable()
export class PropertyService {

  async getByLocation(location : string): Promise<Property[]> {
    const res = await fetch(BASE_URL);
    if(!res.ok){
        throw new BadRequestException()
    }
    const allProperties = await res.json()
    const filtByLocation = allProperties.filter((properties) =>
    properties.location.toLocaleLowerCase().includes(location.toLocaleLowerCase()),
    );
    if(!filtByLocation.length) throw new NotFoundException(`Sin propiedades en alquiler en ${location}`)
    return filtByLocation;
  }

  async getProperties(): Promise<Property[]> {
    const res = await fetch(BASE_URL);
    const parsed = await res.json();
    return parsed;
  }

  async getPropertyById(id: number): Promise<Property> {

   
      const res = await fetch(BASE_URL + id);
      const parsed = await res.json();

      if (Object.keys(parsed).length) return parsed; 
      throw new NotFoundException(`La propiedad con el ID:${id}, no existe.`) 

    }

  private async setId(): Promise<number> {
    const immovables = await this.getProperties();
    const id = immovables.pop().id + 1;
    return id;
  }

  async postProperty(property: PropertyDto): Promise<Property> {
    const id = await this.setId();
    const { title, type, location, rooms, description, price, images } =
      property;
    const newProperty = {
      id,
      title,
      type,
      location,
      rooms,
      description,
      price,
      images,
    };
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProperty),
    });
    const parsed = res.json();
    return parsed;
  }

  async deleteProperty(id: number) {
    const res = await fetch(BASE_URL + id, {
      method: 'DELETE',
    });
    const parsed = res.json();
    return parsed;
  }

  async modifyPropertyById(id: number, propertyDto: PropertyDto): Promise<void> {
    const isProperty = await this.getPropertyById(id);
    if (!Object.keys(isProperty).length) return;
    const modifiedProperty = { ...propertyDto, id };
    await fetch(BASE_URL + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifiedProperty),
    });
  }
}
