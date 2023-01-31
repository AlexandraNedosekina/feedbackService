// https://fonts.google.com/icons
export type TIcons =
	| 'account_circle'
	| 'filter_alt'
	| 'search'
	| 'star'
	| 'home'
	| 'trending_up'
	| 'group'
	| 'double_arrow'
	| 'menu'
	| 'close'
	| 'calendar_month'
	| 'add'
	| 'edit'
	| 'done'
	| 'expand_more'
	| 'file_upload'
	| 'delete'
	| 'sort'
	| 'remove'
	| 'arrow_back_ios_new'
	| 'question_mark'
type TIconType = 'outlined' | 'rounded' | 'sharp'

export interface IIconProps {
	icon: TIcons
	type?: TIconType
	size?: number
	filled?: boolean
	weight?: number
}
