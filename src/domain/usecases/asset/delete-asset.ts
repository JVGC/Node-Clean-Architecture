
export interface DeleteAssetById {
  delete: (asset_id: string) => Promise<boolean>
}
