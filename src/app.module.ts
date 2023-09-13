import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { PropertyModule } from './property/property.module';
import { UserModule } from './user/user.module';
;


//importar todos los modulos que voy a utilizar
@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'client'), serveRoot: '/' }), 
    PropertyModule,
  UserModule ,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}