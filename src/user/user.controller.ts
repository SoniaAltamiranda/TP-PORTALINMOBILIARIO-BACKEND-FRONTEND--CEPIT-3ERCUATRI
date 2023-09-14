import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Body,
  HttpCode,
  Put,
  Query,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';

import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(@Query('name') name?: string): Promise<UserDto[]> {
    if (!name) return this.userService.getUsers();
    return this.userService.getUserByName(name); //tengo que pasar el query param NAME
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