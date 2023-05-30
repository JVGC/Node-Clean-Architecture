import { Unit } from "../../models/unit";

// DECISION: User will only be able to update the company if it has role == SUPERADMIN.

export interface UpdateUnitParams {
    name?: string;
    description?: string;
    company_id?: string
}

export interface UpdateUnit {
    update: (unit_id: string, data: UpdateUnitParams) => Promise<Unit>
}
