export interface Encrypter {
    encrypt: (value: string) => string
}

export interface Decrypter {
    decrypt: (token: string) => string
}

