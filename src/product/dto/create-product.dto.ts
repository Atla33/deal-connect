import {
    IsNotEmpty,
    IsString,
    IsInt,
  } from 'class-validator';
  import { Product } from '../entities/product.entity'

export class CreateProductDto implements Product{

    id: number;

    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsString()
    type:string;

    @IsNotEmpty()
    value:number;

    @IsNotEmpty()
    @IsString()
    seller:string;

    @IsNotEmpty()
    image:string;

    @IsInt()
    @IsNotEmpty()
    userId:number;

}
