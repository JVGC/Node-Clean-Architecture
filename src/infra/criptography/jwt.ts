import jwt, { type JwtPayload } from 'jsonwebtoken'
import { type Decrypter, type Encrypter } from '../../domain/protocols/criptography'

export class JWTEncrypter implements Encrypter {
  constructor (
    private readonly secret: string
  ) {}

  encrypt (value: string): string {
    return jwt.sign({ id: value }, this.secret)
  }
}

export class JWTDecrypter implements Decrypter {
  constructor (
    private readonly secret: string
  ) {}

  decrypt (token: string): string {
    const payload = jwt.verify(token, this.secret) as JwtPayload
    return payload.id
  }
}
