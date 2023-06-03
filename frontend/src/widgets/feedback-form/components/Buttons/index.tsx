import { Button, Group } from '@mantine/core'
import { FormSpy, useForm } from 'react-final-form'

interface IProps {
	isEditing: boolean
	setIsEditing: (value: boolean) => void
	isEmptyFeedback: boolean
	loading: boolean
}

export const Buttons = ({
	isEditing,
	setIsEditing,
	isEmptyFeedback,
	loading,
}: IProps) => {
	const { submit } = useForm()

	function goToEdit() {
		setIsEditing(true)
	}

	function goToSave() {
		setIsEditing(false)
	}

	if (!isEditing && !isEmptyFeedback) {
		return (
			<Group>
				<Button onClick={goToEdit}>Редактировать</Button>
			</Group>
		)
	}

	return (
		<FormSpy>
			{({ hasValidationErrors, pristine, form: { reset } }) => (
				<Group>
					<Button
						disabled={pristine || hasValidationErrors}
						loading={loading}
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
