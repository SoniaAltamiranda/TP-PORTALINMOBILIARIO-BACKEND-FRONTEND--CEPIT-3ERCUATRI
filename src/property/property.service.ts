import { Injectable } from '@nestjs/common';
import { Property } from './property.interface';

const BASE_URL = 'http://localhost:3030/properties/';
@Injectable()
export class PropertyService {
  async getImmovables(): Promise<Property[]> {
    const res = await fetch(BASE_URL);
    const parsed = await res.json();
    return parsed;
  }
  async getPropertyById(id: number): Promise<Property> {
    const res = await fetch(BASE_URL + id);
    const parsed = await res.json();
    return parsed;
  }

  private async setId(): Promise<number> {
    const immovables = await this.getImmovables();
    const id = immovables.pop().id + 1;
    return id;
  }
  async postProperty(property: Property): Promise<Property> {
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
  async modifyPropertyById(id: number, body: Property): Promise<void> {
    const isProperty = await this.getPropertyById(id);
    if (!Object.keys(isProperty).length) return;
    const modifiedProperty = { ...body, id };
    await fetch(BASE_URL + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifiedProperty),
    });
  }
}
