import { Injectable } from '@nestjs/common';
import { iUser } from './user.interface';

const BASE_URL = 'http://localhost:3030/users/';

@Injectable()
export class UserService {
  async getUsers(): Promise<iUser[]> {
    try {
      const res = await fetch(BASE_URL);
      const parsed = await res.json();
      return parsed;
    } catch (error) {
      throw new Error('An error occurred while fetching users.');
    }
  }

  async getUserById(id: number): Promise<iUser> {
    try {
      const res = await fetch(BASE_URL + id);
      const parsed = await res.json();
      return parsed;
    } catch (error) {
      throw new Error('An error occurred while fetching the user.');
    }
  }

  private async setId(): Promise<number> {
    try {
      const users = await this.getUsers();
      const id = users.pop().id + 1;
      return id;
    } catch (error) {
      throw new Error('An error occurred while setting the ID.');
    }
  }

  async createUser(user: iUser): Promise<iUser> {
    try {
      const id = await this.setId();
      const { name, email, phone } = user;

      const newUser = {
        id,
        name,
        email,
        phone,
      };

      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      const parsed = await res.json();
      return parsed;
    } catch (error) {
      throw new Error('An error occurred while creating the user.');
    }
  }

  async deleteUser(id: number) {
    try {
      const res = await fetch(BASE_URL + id, {
        method: 'DELETE',
      });
      const parsed = await res.json();
      return parsed;
    } catch (error) {
      throw new Error('An error occurred while deleting the user.');
    }
  }

  async modUserById(id: number, body: iUser): Promise<void> {
    try {
      const isUser = await this.getUserById(id);
      if (!Object.keys(isUser).length) return;
      const modUser = { ...body, id };
      await fetch(BASE_URL + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modUser),
      });
    } catch (error) {
      throw new Error('An error occurred while modifying the user.');
    }
  }
}
