import { Asset } from "@prisma/client";
import { AssetModelResponse, AssetsStatus } from "../../../domain/models/asset";

type AssetAndUnit = (Asset & {
    unit: {
        name: string;
    };
})

export const adaptAsset = (asset: AssetAndUnit): AssetModelResponse => {
    return {
        id: asset.id,
        name: asset.name,
        description: asset.description,
        unitName: asset.unit.name,
        healthLevel: asset.healthLevel,
        model: asset.model,
        owner: asset.owner,
        status: AssetsStatus[asset.status],
    }
}