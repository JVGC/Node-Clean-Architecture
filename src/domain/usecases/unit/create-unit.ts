import { Unit } from "../../models/unit";

export interface CreateUnitParams {
    name: string;
    description: string;
    company_id: string;
}

export interface CreateUnit {
    create: (data: CreateUnitParams) => Promise<Unit>
}
