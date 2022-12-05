import { createContext } from 'react'
import { Colleagues } from 'src/api/generatedTypes'

export interface IAdminUserCardContext {
	colleagues: Colleagues[]
}

export const AdminUserCardContext = createContext<IAdminUserCardContext | null>(
	null
)
