import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
    // @UseGuards(AuthGuard)
    @Get('me')
    getMe() {
        return 'Hello me';
    }
}
