import { FormInput, required } from '@components/form'
import { Modal, Stack, Title } from '@mantine/core'
import arrayMutators from 'final-form-arrays'
import { FC } from 'react'
import { Form } from 'react-final-form'
import { useAddCareerGrade } from 'src/stores'
import { IFormValues } from '../types'
import SubmitButton from './SubmitButton'
import Tasks from './Tasks'

const defaultInitialValues: IFormValues = {
	title: '',
	salary: '',
	toComplete: [],
	toLearn: [],
	idsToDelete: [],
}

interface Props {
	isOpen: boolean
	onClose: () => void
	initialValues?: IFormValues
}

const AddGradeModal: FC<Props> = ({
	isOpen,
	onClose,
	initialValues = defaultInitialValues,
}) => {
	const isEdit = useAddCareerGrade(state => state.isEdit)

	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title={
				<Title order={4}>
					{isEdit ? 'Редактирование этапа' : 'Создание этапа'}
				</Title>
			}
			size="lg"
		>
			<Form
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				onSubmit={() => {}}
				initialValues={initialValues}
				subscription={{
					submitting: true,
					pristine: true,
				}}
				initialValuesEqual={() => true}
				mutators={{
					...arrayMutators,
				}}
			>
				{props => {
					return (
						<form onSubmit={props.handleSubmit}>
							<Stack>
								<FormInput
									fieldProps={{
										name: 'title',
										validate: required,
									}}
									inputProps={{
										label: 'Название',
										autoComplete: 'off',
										withAsterisk: true,
										required: true,
									}}
								/>
								<FormInput
									fieldProps={{
										name: 'salary',
									}}
									inputProps={{
										label: 'Зарплата',
										type: 'number',
										autoComplete: 'off',
									}}
								/>
								<Tasks title="Что нужно изучить" type="toLearn" />
								<Tasks title="Что нужно сделать" type="toComplete" />

								<SubmitButton onClose={onClose} />
							</Stack>
						</form>
					)
				}}
			</Form>
		</Modal>
	)
}

export default AddGradeModal
