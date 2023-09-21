import {
    IsNotEmpty,
    IsString,
    IsInt,
  } from 'class-validator';
import { Menu } from '../entities/menu.entity';

export class CreateMenuDto implements Menu{

    id:number;

    @IsString()
    @IsNotEmpty()
    date:string;

    @IsString()
    @IsNotEmpty()
    hours:string;

    @IsString()
    @IsNotEmpty()
    value:string;

    @IsString()
    @IsNotEmpty()
    meals:string;

    @IsInt()
    @IsNotEmpty()
    dishId:number;

    @IsInt()
    @IsNotEmpty()
    userId:number;
}
