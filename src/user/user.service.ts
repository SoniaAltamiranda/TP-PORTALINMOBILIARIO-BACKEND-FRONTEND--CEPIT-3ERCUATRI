
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,

} from '@nestjs/common';
import { iUser } from './user.interface';
import { UserDto } from './user.dto';

const BASE_URL = 'http://localhost:3030/users/';

@Injectable()
export class UserService {

  private readonly logger = new Logger(UserService.name);

  async authenticateUser(name: string, password: string): Promise<boolean> {
    try {
      const res = await fetch(BASE_URL + 'authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });

      this.logger.log(`Authentication request sent to ${BASE_URL} with name: ${name}`);
      return res.status === 200;
    } catch (error) {
      this.logger.error('An error occurred while authenticating the user:', error);
      throw new Error('An error occurred while authenticating the user.');
    }
  }

  async getUsers(): Promise<iUser[]> {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) {
        throw new BadRequestException(
          'Error al obtener la lista de usuarios desde el servidor remoto',
        );
      }
      return await res.json();
    } catch (error) {
      throw new BadRequestException(
        'Error al obtener la lista de usuarios',
      );
    }
  }

  async getUserByName(name: string): Promise<UserDto | null> {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) {
        throw new BadRequestException(
          'Error al obtener la lista de usuarios desde el servidor remoto',
        );
      }
      const allUsers = await res.json();
      const foundUser = allUsers.find((usr) =>
        usr.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
      );
      return foundUser || null; // Devuelve el usuario encontrado o null si no se encuentra ninguno
    } catch (error) {
      throw new BadRequestException(
        'Error al buscar usuarios por nombre',
      );
    }
  }

  async getUserById(id: number): Promise<UserDto> {
    try {
      const res = await fetch(BASE_URL + id);
      if (!res.ok) {
        throw new BadRequestException(
          `Error al obtener el usuario con ID: ${id} desde el servidor remoto`,
        );
      }
      const parsed = await res.json();
      if (!Object.keys(parsed).length) return;
      return parsed;
    } catch (error) {
      throw new BadRequestException(
        `Error al buscar usuario por ID: ${id}. ID inexistente.`,
      );
    }
  }

  private async setId(): Promise<number> {
    try {
      const users = await this.getUsers();
      const id = users.pop().id + 1;
      return id;
    } catch (error) {
      throw new BadRequestException(
        'Error al obtener el último ID de usuario',
      );
    }
  }

  async createUser(user: UserDto): Promise<UserDto> {
    try {
      const id = await this.setId() + 1;
      const { name, email, phone } = user;
      const newUser = { id, name, email, phone };
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) {
        throw new BadRequestException('Error al crear el usuario');
      }
      return await res.json();
    } catch (error) {
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const res = await fetch(BASE_URL + id, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new BadRequestException(
          `Error al eliminar el usuario con ID: ${id}.`,
        );
      }
    } catch (error) {
      throw new BadRequestException(
        `Error al eliminar el usuario con ID: ${id}. Usuario inexistente.`,
      );
    }
  }

  async updateUserById(id: number, userDto: UserDto): Promise<void> {
    try {
      const isUser = await this.getUserById(id);
      if (!isUser) {
        throw new NotFoundException(
          `Usuario con ID: ${id} no existe, no se puede modificar`,
        );
      }
      const modUser = { ...userDto, id };
      const res = await fetch(BASE_URL + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modUser),
      });
      if (!res.ok) {
        throw new BadRequestException(
          `Error al actualizar el usuario con ID: ${id}`,
        );
      }
    } catch (error) {
      throw new BadRequestException(
        `Error al actualizar el usuario con ID: ${id}`,
      );
    }
  }
}

