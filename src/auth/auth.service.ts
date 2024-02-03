import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) { }

  async signup({ email, password }: AuthDto) {
    // hash the password
    const hash = await argon.hash(password);

    // save user in DB
    try {
      const response = await this.prisma.user.create({
        data: { email, hash },
      });

      delete response.hash;
      // return new user
      return response;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if ((error.code = 'P2002')) {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  login() {
    return 'I am logged in';
  }
}
