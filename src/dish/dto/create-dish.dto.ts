import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';

import { Dish } from "../entities/dish.entity";

export class CreateDishDto implements Dish {

    id:number;

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsString()
    @IsNotEmpty()
    description:string;

}
