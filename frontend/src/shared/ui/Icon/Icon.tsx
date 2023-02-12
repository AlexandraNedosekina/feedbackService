import { IIconProps } from './types'

const Icon = ({
	icon,
	size,
	filled = false,
	type = 'outlined',
	weight = 300,
}: IIconProps) => {
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
