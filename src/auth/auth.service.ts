import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

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

  async login({ email, password }: AuthDto) {
    // find the user by email
    const account = await this.prisma.user.findUnique({
      where: { email: email },
    });
    // if user doesnt exist throw exception
    if (!account) throw new NotFoundException('User not found');
    // if password is incorrect throw exception
    const passwordMatches = await argon.verify(account.hash, password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Email or Password is Incorrect');
    }
    // send back the user
    delete account.hash;
    console.log(account);
    return account;
  }
}
