import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  Post,
  Delete,
  Body,
  HttpCode,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { iUser } from './user.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<iUser[]> {
    return this.userService.getUsers();
  }

  @Get('/:id')
  async getUserById( @Param('id') id: number): Promise<iUser> {
    return this.userService.getUserById(id);
  }
  @Post()
  async createUser(@Res() response, @Body() body): Promise<any> {
    const responseFromService = await this.userService.createUser(body);
    if (Object.keys(responseFromService).length) {
      return response.status(HttpStatus.CREATED).json({
        message: 'User created with success.',
      });
    } else {
      return response.status(HttpStatus.BAD_REQUEST).json({
        error: 'An error occurred while creating the user.',
      });
    }
  }

  @Delete('/:id')
  async deleteUser(@Res() response, @Param('id') id: number): Promise<void> {
    const userToDelete = await this.userService.getUserById(id);
    if (!Object.keys(userToDelete).length) {
      return response.status(HttpStatus.NOT_FOUND).json({
        error: 'User not found',
      });
    } else {
      await this.userService.deleteUser(id);
      return response.status(HttpStatus.OK).json({
        message: 'User deleted with success',
      });
    }
  }
  @Put('/:id')
  @HttpCode(204)
  modUser(
    @Res() response,
    @Param('id') id: number,
    @Body() body,
  ): Promise<void> {
    return this.userService.modUserById(id, body);
  }
}
