import { Button } from '@mantine/core'

const SubmitButton = () => {
	return (
		<Button
			sx={() => ({
				alignSelf: 'flex-end',
			})}
		>
			Добавить
		</Button>
	)
}

export default SubmitButton
