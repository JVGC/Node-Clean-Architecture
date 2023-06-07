export interface Validator {
  validate: (input: object) => Promise<Error | undefined>
}
