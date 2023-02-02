import { Button, Group } from '@mantine/core'
import { useRouter } from 'next/router'
import { FormSpy, useForm } from 'react-final-form'

export const Buttons = () => {
	const { submit } = useForm()
	const router = useRouter()

	function goToEmpty() {
		router.push('/feedback/')
	}

	return (
		<FormSpy>
			{({ hasValidationErrors, pristine, submitting }) => (
				<Group>
					<Button
						disabled={pristine || hasValidationErrors}
						loading={submitting}
						onClick={submit}
					>
						Сохранить
					</Button>
					<Button
						variant="outline"
						style={{ background: 'white' }}
						onClick={goToEmpty}
					>
						Отмена
					</Button>
				</Group>
			)}
		</FormSpy>
	)
}
