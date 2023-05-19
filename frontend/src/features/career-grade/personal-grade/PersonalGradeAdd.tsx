import { Button } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { FormSpy } from 'react-final-form'
import { createCareerTrack, QueryKeys } from 'shared/api'
import { CareerParamCreate, CareerTrackCreate } from 'shared/api/generatedTypes'
import { Form } from '../components'

interface IProps {
	onDone?: () => void
}

export const PersonalGradeAdd = ({ onDone }: IProps) => {
	const {
		query: { id },
	} = useRouter()
	const queryClient = useQueryClient()

	const { mutate: create, isLoading: isCreateLoading } = useMutation({
		mutationFn: (data: CareerTrackCreate) => createCareerTrack(data),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_BY_USER_ID, id])
			onDone?.()
		},
	})

	return (
		<Form
			onSubmit={values => {
				const toLearn: CareerParamCreate[] = values.toLearn.map(item => ({
					description: item.text,
					type: 'to_learn',
				}))
				const toComplete: CareerParamCreate[] = values.toComplete.map(
					item => ({
						description: item.text,
						type: 'to_complete',
					})
				)

				const data: CareerTrackCreate = {
					user_id: +(id as string),
					name: values.title,
					salary: +values.salary ?? 0,
					params: [...toLearn, ...toComplete],
				}

				create(data)
			}}
			submitButtons={
				<FormSpy>
					{({ invalid, hasValidationErrors, submitting, dirty }) => (
						<Button
							sx={() => ({
								alignSelf: 'flex-end',
							})}
							type="submit"
							loading={isCreateLoading}
							disabled={
								invalid || hasValidationErrors || submitting || !dirty
							}
						>
							Добавить
						</Button>
					)}
				</FormSpy>
			}
		/>
	)
}
