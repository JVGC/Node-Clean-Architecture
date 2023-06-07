import { z } from 'zod'
import { type Validator } from '../../protocols/validator'

export class ZodLoginValidator implements Validator {
  zodObject: z.ZodObject<any>
  constructor () {
    this.zodObject = z.object({
      email: z.string().email(),
      password: z.string()
    })
  }

  async validate (input: object): Promise<Error | undefined> {
    const isValid = this.zodObject.safeParse(input)
    if (!isValid.success) {
      return isValid.error
    }
  }
}
