
// DUVIDA: What to do with the assets that belongs to the unit?
export interface DeleteUnitById {
  delete: (unit_id: string) => Promise<boolean>
}
