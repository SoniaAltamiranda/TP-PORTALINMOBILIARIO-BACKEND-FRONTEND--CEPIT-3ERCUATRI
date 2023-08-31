import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { PropertyModule } from './property/property.module';
import { UserModule } from './user/user.module';
;

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'client') }),
    PropertyModule,
  UserModule ,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}