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
	| 'sort'
	| 'remove'
	| 'arrow_back_ios_new'
	| 'question_mark'
type IconType = 'outlined' | 'rounded' | 'sharp'

export interface IconProps {
	icon: Icons
	type?: IconType
	size?: number
	filled?: boolean
	weight?: number
}

const Icon: FC<IconProps> = ({
	icon,
	size,
	type = 'outlined',
	weight = 300,
	filled,
}) => {
	return (
		<span
			className={`material-symbols-${type}`}
			style={{
				fontSize: size ? `${size}px` : 'inherit',
				fontVariationSettings: `'FILL' ${
					filled ? '1' : '0'
				}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 48`,
			}}
		>
			{icon}
		</span>
	)
}

export default Icon
