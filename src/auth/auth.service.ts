import { Injectable} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class AuthService {

  constructor(private readonly userService:UserService,
    private readonly jwtService: JwtService,){}

  login(user: any): UserToken {

    const payload: UserPayload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    
    };
    
    const tokens = {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };

    return {
      token: tokens,
      user: { ...user },
    };

  }

  async validateUser(email: string, password: string) {
      const user = await this.userService.findByEmail(email);

      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){
          return {
            ...user,
            password: undefined,
          }
        }
      }

      throw new Error('Invalid email or password');
  }

    async refreshToken(user: User) {
    const payload = { username: user.username, sub: user.id };
    const tokens = {
      access_token: this.jwtService.sign(payload),
    };

    return {
      token: tokens,
    };
  }
}