import { AdminUserCardContext } from '@components/AdminUserCard/AdminUserCardContext'
import { useContext } from 'react'

export const useAdminUserCardContext = () => {
	const context = useContext(AdminUserCardContext)

	if (!context) {
		throw new Error(
			'useAdminUserCardContext must be used within a AdminUserCardContext'
		)
	}

	return context
}
