import { FormInput, required } from '@components/form'
import { Button, Flex, Modal, Stack, Title } from '@mantine/core'
import arrayMutators from 'final-form-arrays'
import { FC, useState } from 'react'
import { Form, FormSpy } from 'react-final-form'
import { useAddCareerGrade } from 'src/stores'
import { IFormValues } from '../types'
import Tasks from './Tasks'

interface Props {
	isOpen: boolean
	onClose: () => void
}

const AddGradeModal: FC<Props> = ({ isOpen, onClose }) => {
	const isEdit = useAddCareerGrade(state => state.isEdit)
	const [idsToDelete, setIdsToDelete] = useState<string[]>([])

	// @ts-expect-error implicity any
	function onSubmit(data) {
		console.log(data)
	}

	const initialValues: IFormValues = {
		title: '',
		salary: '',
		toComplete: [
			{
				text: 'test',
				id: '10',
			},
		],
		toLearn: [],
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
								<Tasks
									title="Что нужно изучить"
									type="toLearn"
									onDelete={id =>
										setIdsToDelete(prev => [...prev, id])
									}
								/>
								<Tasks
									title="Что нужно сделать"
									type="toComplete"
									onDelete={id =>
										setIdsToDelete(prev => [...prev, id])
									}
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
										form: { getState },
									}) => {
										console.log(getState())
										return (
											<>
												<pre>
													{JSON.stringify(
														getState().values,
														null,
														2
													)}
												</pre>
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
											</>
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
