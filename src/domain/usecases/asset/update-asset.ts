import { Asset } from "../../models/asset";


// DECISION: From my perspective, the status depends on the health level
// So it's not a property that the user can edit. That's why I'm not allowing it to be edit here.

// DECISION: User will only be able to update the owner if it has role >= ADMIN.

export interface UpdateAssetParams {
    name?: string;
    description?: string;
    model?: string;
    owner_id?: string;
    unit_id?: string;
    health_level?: number
}

export interface UpdateAsset {
    update: (data: UpdateAssetParams) => Promise<Asset>
}
