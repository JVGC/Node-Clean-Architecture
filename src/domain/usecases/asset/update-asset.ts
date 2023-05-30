import { Asset } from "../../models/asset";


// DECISION: From my perspective, the asset health level would come from other source besides the user.
// So, with that assumption in mind, I don't see the user using this route to update the health level together with the other properties.
// That's why I'm not allowing health- level and status to be update here.

// DECISION: User will only be able to update the owner if it has role >= ADMIN.

export interface UpdateAssetParams {
    name?: string;
    description?: string;
    model?: string;
    owner_id?: string;
    unit_id?: string;
}

export interface UpdateAsset {
    update: (data: UpdateAssetParams) => Promise<Asset>
}
