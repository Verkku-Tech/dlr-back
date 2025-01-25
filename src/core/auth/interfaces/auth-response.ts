import { User } from '../../../core/users/entities/user.entity'

export interface AuthResponse {
  user: User
  token: string
}
