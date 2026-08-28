import type {user} from "./user"

export interface Auth{
    accessToken: string
    user: user
}