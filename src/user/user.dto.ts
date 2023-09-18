import { IsString } from "class-validator"; //reglas de validaciones


export class UserDto{
   
    @IsString()
    name: string;
    @IsString()
    email: string;
    @IsString()
    phone: string;
    @IsString()
    contrasena: string;
  
}