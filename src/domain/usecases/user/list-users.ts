import { User } from "../../models/user";

export interface ListUnits {
  list: () => Promise<User[]>
}
