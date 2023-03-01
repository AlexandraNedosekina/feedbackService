import { TIcons } from 'shared/ui'

export interface INavItem {
	type: 'base' | 'component'
	component?: React.FC
	icon?: TIcons
	href?: string
	text?: string
}

export type TNavPages = 'feedback' | 'career' | 'calendar'
