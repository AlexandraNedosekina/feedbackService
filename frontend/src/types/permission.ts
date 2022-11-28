export enum ERoles {
	ADMIN = 'admin',
	USER = 'user',
}

export enum EScopes {
	canCreate = 'can-create',
	canEdit = 'can-edit',
	canDelete = 'can-delete',
	canView = 'can-view',
}

export type IPermission = Record<ERoles, EScopes[]>
