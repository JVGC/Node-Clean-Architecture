import jwt from 'jsonwebtoken';
import { Encrypter } from "../../domain/protocols/criptography";

export class JWTEncrypter implements Encrypter{
    constructor(
        private readonly secret: string
    ){}
    encrypt(value: string): string{
        return jwt.sign({ id: value }, this.secret)
    }
}