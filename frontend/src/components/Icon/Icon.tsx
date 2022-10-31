import { FC } from 'react'

// https://fonts.google.com/icons
export type Icons =
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
type IconType = 'outlined' | 'rounded' | 'sharp'

export interface IconProps {
	icon: Icons
	type?: IconType
	size?: number
	filled?: boolean
}

const Icon: FC<IconProps> = ({ icon, size, type = 'outlined', filled }) => {
	return (
		<span
			className={`material-symbols-${type}`}
			style={{
				fontSize: size ? `${size}px` : 'inherit',
				fontVariationSettings: `'FILL' ${
					filled ? '1' : '0'
				}, 'wght' 300, 'GRAD' 0, 'opsz' 48`,
			}}
		>
			{icon}
		</span>
	)
}

export default Icon
