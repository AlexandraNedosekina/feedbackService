import { FC, ReactNode } from 'react'
import { ERoles, EScopes, IPermission } from 'src/types/permission'

const PERMISSIONS: IPermission = {
	[ERoles.ADMIN]: [
		EScopes.canCreate,
		EScopes.canDelete,
		EScopes.canEdit,
		EScopes.canView,
	],
	[ERoles.USER]: [EScopes.canView],
}

const hasPermission = ({
	permissions,
	scopes,
}: {
	permissions: EScopes[]
	scopes: EScopes[]
}): boolean => {
	return scopes.every(scope => permissions.includes(scope))
}

interface Props {
	children: ReactNode | ReactNode[]
	scopes: EScopes[]
}

const PermissionGuard: FC<Props> = ({ children, scopes = [] }) => {
	const role = ERoles.USER
	const permissions = PERMISSIONS[role]

	const permissionGranted = hasPermission({ permissions, scopes })

	if (!permissionGranted) {
		return <div>Permission denied</div>
	}
	return <>{children}</>
}

export default PermissionGuard
