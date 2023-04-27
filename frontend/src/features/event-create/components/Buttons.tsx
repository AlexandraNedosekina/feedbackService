import { Button, Flex } from '@mantine/core'
import { FormSpy } from 'react-final-form'

interface IProps {
	handleSubmit: () => void
	onCancel?: () => void
}

const Buttons = ({ onCancel, handleSubmit }: IProps) => {
	return (
		<FormSpy>
			{({ invalid, submitting, values }) => (
				<>
					{/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
					<Flex justify={'flex-end'} mt="lg">
						<Button
							onClick={handleSubmit}
							loading={submitting}
							disabled={invalid}
						>
							Создать
						</Button>
						{onCancel ? (
							<Button onClick={onCancel} variant="outline" ml="md">
								Отмена
							</Button>
						) : null}
					</Flex>
				</>
			)}
		</FormSpy>
	)
}

export default Buttons
