import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTPayload } from './jwt.payload.interface';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as config from 'config';

//This is class used for validate jwt token
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      //we want to extract jwt from request
      //here is how
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //get the Bearer from Auth Prameter of Request Header
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'), //The sescret the passport is going to use to verify the token
    });
  }

  //What return from this function is going to be
  //injected into the request
  //any operation that is guared with authentication
  async validate(payload: JWTPayload): Promise<User> {
    const { username } = payload;
    const user = this.userRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
