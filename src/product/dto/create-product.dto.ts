import {
    IsInt,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
import { Product } from "../entities/product.entity";

export class CreateProductDto implements Product {
    id:number;

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsString()
    @IsNotEmpty()
    type:string;

    @IsString()
    @IsNotEmpty()
    value:string;

    @IsString()
    @IsNotEmpty()
    image:string;

    @IsInt()
    @IsNotEmpty()
    userId:number;

    @IsString()
    @IsNotEmpty()
    description:string;
}
