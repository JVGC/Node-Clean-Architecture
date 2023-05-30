
export interface DeleteUserById {
  delete: (user_id: string) => Promise<boolean>
}
