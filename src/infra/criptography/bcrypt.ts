import bcrypt from 'bcrypt'
import { Hasher } from '../../domain/protocols/criptography'

export class BcryptAdapter implements Hasher {
  constructor (private readonly rounds: number) {}

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.rounds)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}