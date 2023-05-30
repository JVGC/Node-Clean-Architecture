import { Asset } from "../../models/asset";

export interface GetAssetById {
  get: (asset_id: string) => Promise<Asset>
}
