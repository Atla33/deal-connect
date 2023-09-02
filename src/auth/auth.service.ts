import { Injectable} from '@nestjs/common';


@Injectable()
export class AuthService {
  validateUser(email: string, password: string, username: string) {
      throw new Error('Method not implemented.');
  }
}