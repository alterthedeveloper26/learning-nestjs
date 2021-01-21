import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDTO } from './dto/authenticate.dto';
import { UserRepository } from './user.repository';
import { JWTPayload } from './jwt.payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    //If want to use in a class you have to inject it first
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authDTO: AuthDTO): Promise<void> {
    return this.userRepository.signUp(authDTO);
  }

  async signIn(authDTO: AuthDTO): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(authDTO);

    if (!username) {
      throw new UnauthorizedException('Invalid login');
    }

    const payload: JWTPayload = { username };
    const accessToken = await this.jwtService.sign(payload); //assign username to payload
    this.logger.debug(
      `Generated 3WT Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }
}
