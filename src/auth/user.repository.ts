import { UnauthorizedException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUser(username: string): Promise<User> {
    const user = this.findOne({ username });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async addUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = this.create();
    user.username = username;
    user.password = password;

    try {
      await user.save();
    } catch {
      // for not throwing the duplicate error
    }
  }
}
