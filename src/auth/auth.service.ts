import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup({ email, password }: AuthDto) {
    // hash the password
    const hash = await argon.hash(password);

    // save user in DB
    const response = await this.prisma.user.create({
      data: { email, hash },
    });
    // return new user
    return response;
  }

  login() {
    return 'I am logged in';
  }
}
