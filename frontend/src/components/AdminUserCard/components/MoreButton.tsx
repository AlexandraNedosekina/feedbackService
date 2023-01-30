import { Text } from '@mantine/core'
import { FC } from 'react'
import tableStyles from 'styles/table.module.sass'

interface Props {
	onClick?: () => void
}

const MoreButton: FC<Props> = ({ onClick }) => {
	return (
		<Text
			className={tableStyles['active-hover']}
			align="right"
			color="brand.4"
			sx={() => ({
				cursor: 'pointer',
			})}
			onClick={onClick}
		>
			Подробнее
		</Text>
	)
}

export default MoreButton
