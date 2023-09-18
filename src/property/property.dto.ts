import { IsString,IsArray, IsInt} from 'class-validator'
export class PropertyDto {
    @IsString()
    title: string;
    @IsString()
    location: string;
    @IsString()
    type: string;
    @IsInt()
    rooms: number;
    @IsString()
    description: string;
    @IsInt()
    price: number;
    @IsArray()
    @IsString({each : true}) 
    // {each : true} => valida que cada elemento del array sea un string.
    // tenemos que acomodar el modelo de datos ya que podemos validar que sea un arreglo de urls.
    images: string[];
}