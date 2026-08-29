import type { User } from "./user"

export interface Auth {
  accessToken: string
  user: User
}
