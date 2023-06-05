export interface Encrypter {
  encrypt: (value: string) => string
}

export interface Decrypter {
  decrypt: (token: string) => string
}
export interface Hasher {
  hash: (value: string) => Promise<string>
  compare: (value: string, hash: string) => Promise<boolean>
}
