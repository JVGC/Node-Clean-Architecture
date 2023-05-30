import { User } from "../../models/user";

export interface GetUserById {
  get: (user_id: string) => Promise<User>
}
