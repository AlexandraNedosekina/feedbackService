import { Text } from '@mantine/core'

interface IProps {
	onClick?: () => void
}

const MoreButton = ({ onClick }: IProps) => {
	return (
		<Text
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
