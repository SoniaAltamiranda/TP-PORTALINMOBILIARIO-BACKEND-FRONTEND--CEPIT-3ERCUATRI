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
    images: string[];
}