import { Role } from "@prisma/client";

export interface UserPayload {
    sub: number;
    email: string;
    name: string;
    role: Role;
    //username: string;
    iat?: number;
    exp?: number;
  }