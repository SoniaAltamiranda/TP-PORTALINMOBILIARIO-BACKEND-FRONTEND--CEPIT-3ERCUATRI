import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Res,
  Body,
  HttpCode,
  Put,
  Query,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';

import { UserDto } from './user.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/authenticate')
  async authenticateUser(@Res() response, @Body() body:{name: string, password: string }): Promise<any> {
    try {
      const user = await this.userService.getUserByName(body.name);
      if (user.name === body.name && user.password === body.password) {
        return response.status(HttpStatus.OK).json({
          message: 'Authentication successful.',
        });
      } else {
        return response.status(HttpStatus.UNAUTHORIZED).json({
          error: 'Authentication failed.',
        });
      }
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'An error occurred during authentication.',
      });
    }
  }

  async getUserByName(@Query('name') name?: string): Promise<UserDto | null> {
    if (!name) return null; // Retorna null si no se proporciona un nombre
    return this.userService.getUserByName(name);
  }

  @Get('/:id') //inyectamos el parametro id
  async getUserById(
    @Param(
      'id',
      new ParseIntPipe({
        //estoy esperando un numero
        //error 406
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<UserDto> {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() userDto: UserDto): Promise<any> {
    return this.userService.createUser(userDto);
  }

  @Delete('/:id')
  async deleteUser(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Put('/:id')
  @HttpCode(204)
  modUser(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_FOUND,
      }),
    )
    id: number,
    @Body() userDto: UserDto,
  ): Promise<void> {
    return this.userService.updateUserById(id, userDto);
  }
}
