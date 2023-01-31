import { Text } from '@mantine/core'
import tableStyles from 'styles/table.module.sass'

interface IProps {
	onClick?: () => void
}

const MoreButton = ({ onClick }: IProps) => {
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
