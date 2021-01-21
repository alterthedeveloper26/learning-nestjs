import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser, getUser2 } from './decorator/get-user.decorator';
import { AuthDTO } from './dto/authenticate.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authDTO: AuthDTO): Promise<void> {
    return this.authService.signUp(authDTO);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authDTO: AuthDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authDTO);
  }

  @Post('/test')
  @UseGuards(AuthGuard()) //to use strategy i think
  test(@getUser2() user: User) {
    return user;
  }
  // @Post('/test')
  // @UseGuards(AuthGuard()) //to use strategy i think
  // test(@Req() req) {
  //   console.log(req.user);
  // }
}
