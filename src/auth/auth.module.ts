import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import * as config from '../../node_modules/config';

const jwtConfig = config.get('jwt');

@Module({
  //the list of imported modules that export the providers which are required in this module
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  //the set of controllers defined in this module which have to be instantiated
  controllers: [AuthController],
  //the providers that will be instantiated by the Nest injector and that may be shared at least across this module
  providers: [AuthService, JwtStrategy],
  //the subset of providers that are provided by this module and should be available in other modules which import this module
  exports: [JwtStrategy, PassportModule], //Export passport to make it possible to guard orther
})
export class AuthModule {}
