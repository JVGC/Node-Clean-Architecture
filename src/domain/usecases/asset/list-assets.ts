import { Asset } from "../../models/asset"

// DECISION: Usually, I would do pagination here, but as it is a small project for now, I will work on other things.
export interface ListAssets {
  list: () => Promise<Asset[]>
}
