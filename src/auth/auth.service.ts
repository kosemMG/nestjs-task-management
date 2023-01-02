import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../tasks/dto/jwt-payload';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>,
              private readonly jwt: JwtService) {
  }

  public async signup({ username, password }: AuthCredentialsDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const user = await this.repo.create({ username, password: hash });
    let savedUser: User;
    try {
      savedUser = await this.repo.save(user);
    } catch (error) {
      throw error.code === '23505' // duplicate username
        ? new ConflictException('Username already exists')
        : new InternalServerErrorException();
    }
    return savedUser;
  }

  public async login({ username, password }: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const user = await this.repo.findOneBy({ username });

    if (user && await bcrypt.compare(password, user.password)) {
      const payload: JwtPayload = { username };
      return { accessToken: this.jwt.sign(payload) };
    }

    throw new UnauthorizedException('Wrong credentials');
  }
}