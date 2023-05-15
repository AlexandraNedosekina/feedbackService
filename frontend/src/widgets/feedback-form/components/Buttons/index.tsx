import { Button, Group } from '@mantine/core'
import { FormSpy, useForm } from 'react-final-form'

interface IProps {
	isEditing: boolean
	setIsEditing: (value: boolean) => void
	isEmptyFeedback: boolean
}

export const Buttons = ({
	isEditing,
	setIsEditing,
	isEmptyFeedback,
}: IProps) => {
	const { submit } = useForm()

	function goToEdit() {
		setIsEditing(true)
	}

	function goToSave() {
		setIsEditing(false)
	}

	if (!isEditing) {
		return (
			<Group>
				<Button onClick={goToEdit}>Редактировать</Button>
			</Group>
		)
	}

	return (
		<FormSpy>
			{({ hasValidationErrors, pristine, submitting, form: { reset } }) => (
				<Group>
					<Button
						disabled={pristine || hasValidationErrors}
						loading={submitting}
						onClick={submit}
					>
						Сохранить
					</Button>
					{!isEmptyFeedback && (
						<Button
							variant="outline"
							style={{ background: 'white' }}
							onClick={() => {
								reset()
								goToSave()
							}}
						>
							Отмена
						</Button>
					)}
				</Group>
			)}
		</FormSpy>
	)
}
