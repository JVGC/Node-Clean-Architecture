import { Asset } from "../../models/asset";

export interface CreateAssetParams {
    name: string;
    description: string;
    model: string;
    owner_id: string;
    unit_id: string;
}

export interface CreateAsset {
    create: (data: CreateAssetParams) => Promise<Asset>
}
