import { FormInput, required } from '@components/form'
import { Button, Flex, Modal, Stack, Title } from '@mantine/core'
import { FC } from 'react'
import { Form, FormSpy } from 'react-final-form'
import { useAddCareerGrade } from 'src/stores'

interface Props {
	isOpen: boolean
	onClose: () => void
}

interface FormValues {
	title: string
	salary: string
}

const AddGradeModal: FC<Props> = ({ isOpen, onClose }) => {
	const isEdit = useAddCareerGrade(state => state.isEdit)

	// @ts-expect-error implicity any
	function onSubmit(data) {
		console.log(data)
	}

	const initialValues: FormValues = {
		title: '',
		salary: '',
	}

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
				onSubmit={onSubmit}
				initialValues={initialValues}
				subscription={{
					submitting: true,
					pristine: true,
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
								{/* <SalaryInput />
        <Tasks title="Что нужно изучить" type="toLearn" />
    <Tasks title="Что нужно сделать" type="toComplete" /> */}
								{/* <SubmitButton onClose={onClose} /> */}
								<FormSpy>
									{({
										hasValidationErrors,
										submitting,
										pristine,
										invalid,
									}) => {
										return (
											<Flex justify={'end'}>
												<Button
													type="submit"
													disabled={
														submitting ||
														pristine ||
														invalid ||
														hasValidationErrors
													}
												>
													Submit
												</Button>
											</Flex>
										)
									}}
								</FormSpy>
							</Stack>
						</form>
					)
				}}
			</Form>
		</Modal>
	)
}

export default AddGradeModal
