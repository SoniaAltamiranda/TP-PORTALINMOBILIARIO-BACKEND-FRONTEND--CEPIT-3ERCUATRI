import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { OwnersController } from './owners/owners.controller';
import { OwnersService } from './owners/owners.service';
import { PropertiesController } from './propierties/properties.controller';
import { PropertiesService } from './propierties/properties.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'client') }),
  ],
  controllers: [
    AppController,
    PropertiesController,
    UsersController,
    OwnersController,
  ],
  providers: [AppService, PropertiesService, UsersService, OwnersService],
})
export class AppModule {}
