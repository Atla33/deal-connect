import {
    IsInt,
  } from 'class-validator';
import { Favorite } from "../entities/favorite.entity";

export class CreateFavoriteDto implements Favorite {

    id:number;

    @IsInt()
    userId:number;
    
    @IsInt()
    favoritedUserId:number;
}
