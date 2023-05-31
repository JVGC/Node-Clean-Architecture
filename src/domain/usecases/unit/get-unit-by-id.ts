import { Unit } from "../../models/unit";

export interface GetUnitById {
  get: (unit_id: string) => Promise<Unit>
}
