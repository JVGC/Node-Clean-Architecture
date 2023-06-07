import { type z } from 'zod'
import { type Validator } from '../protocols/validator'

export class ZodValidator implements Validator {
  constructor (private readonly zodObject: z.ZodObject<any>) {
  }

  async validate (input: object): Promise<Error | undefined> {
    const isValid = this.zodObject.safeParse(input)
    if (!isValid.success) {
      return isValid.error
    }
  }
}
