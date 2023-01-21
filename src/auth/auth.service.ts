import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcypt from 'bcryptjs';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async register(registrationData: RegisterDto) {
    const hashedPassword = await bcypt.hash(registrationData.password, 10);
    const userData = {
      email: registrationData.email,
    };

    return this.usersService.create(userData, hashedPassword);
  }
}
