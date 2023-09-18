import { Role } from '@prisma/client';

export class User {
    id: number;
    name:string;     
    phone:string;         
    email: string;         
    username: string;
    password: string;
    role: Role;     
}
