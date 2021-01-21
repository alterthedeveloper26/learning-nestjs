import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository } from 'typeorm';
import { AuthDTO } from './dto/authenticate.dto';
import { User } from './user.entity';
import * as bcrypt from '../../node_modules/bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(auth: AuthDTO): Promise<void> {
    const { username, password } = auth;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      // console.log(error.code);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username duplicated');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authDTO: AuthDTO): Promise<string> {
    const { username, password } = authDTO;

    const user = await this.findOne({ username });

    if (user && user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }
}
