import { Unit } from "../../models/unit";

export interface ListUnits {
  list: () => Promise<Unit[]>
}
