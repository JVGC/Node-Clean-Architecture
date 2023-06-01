import { Unit } from "@prisma/client";
import { UnitModelResponse } from "../../../domain/models/unit";

type UnitAndCompany = (Unit & {
    company: {
        name: string;
    };
})

export const adaptUnit = (unit: UnitAndCompany): UnitModelResponse => {
    return {
        id: unit.id,
        name: unit.name,
        description: unit.description,
        companyName: unit.company.name,
        companyId: unit.companyId
    }
}