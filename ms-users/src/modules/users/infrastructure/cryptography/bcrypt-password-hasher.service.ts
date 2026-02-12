import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordHasher } from '../../application/ports/password-hasher.port';

@Injectable()
export class BcryptPasswordHasherService implements PasswordHasher {
  private readonly rounds = 10;

  hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.rounds);
  }

  compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
