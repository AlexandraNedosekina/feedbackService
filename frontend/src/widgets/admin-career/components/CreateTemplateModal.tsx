import { Button, Flex, Modal } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { Form } from 'react-final-form'
import { createCareerTemplate } from 'shared/api'
import { FormInput, required } from 'shared/ui'

interface IProps {
	isOpen: boolean
	onClose: () => void
}

export default function CreateTemplateModal({ isOpen, onClose }: IProps) {
	const router = useRouter()

	const { mutate, isLoading } = useMutation({
		mutationFn: (title: string) =>
			createCareerTemplate({ name: title, template: [] }),
		onSuccess: res => {
			router.push('/career/template/' + res.id)
		},
	})

	function submitHandler(values: { title: string }) {
		mutate(values.title)
	}

	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title="Создание шаблона"
			size={'md'}
		>
			<Form<{ title: string }> onSubmit={submitHandler}>
				{({ handleSubmit, valid, dirty }) => (
					<form onSubmit={handleSubmit}>
						<FormInput
							name="title"
							validate={required}
							label="Название"
						/>

						<Flex justify={'end'} mt="lg">
							<Button
								type="submit"
								disabled={!valid || !dirty}
								loading={isLoading}
							>
								Продолжить
							</Button>
						</Flex>
					</form>
				)}
			</Form>
		</Modal>
	)
}
