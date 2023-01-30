import { Modal, Stack, Textarea, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { getFeedback, QueryKeys } from 'shared/api'
import CategoryRating from './CategoryRating'

interface Props {
	isOpen: boolean
	onClose: () => void
	feedbackId: number | null
}

const FeedbackModal: FC<Props> = ({ isOpen, onClose, feedbackId }) => {
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.FEEDBACK, feedbackId],
		queryFn: () => {
			if (!feedbackId) return null
			return getFeedback(feedbackId)
		},
		enabled: !!feedbackId,
	})

	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			title={<Title order={3}>Просмотр обратной связи</Title>}
			size="xl"
		>
			{isLoading ? (
				// TODO: add loading skeleton
				<p>Загрузка...</p>
			) : data ? (
				<>
					<Stack
						sx={() => ({
							maxWidth: 'max-content',
						})}
						my={40}
					>
						<CategoryRating
							category="Выполнение задач"
							rating={data.task_completion || 0}
						/>
						<CategoryRating
							category="Вовлеченность"
							rating={data.involvement || 0}
						/>
						<CategoryRating
							category="Мотивация"
							rating={data.motivation || 0}
						/>
						<CategoryRating
							category="Взаимодействие с командой"
							rating={data.interaction || 0}
						/>
					</Stack>
					<Stack maw={'400px'} pb={1}>
						<Textarea
							placeholder="Опишите, какие успехи достигнуты"
							label="Достижения"
							defaultValue={data.achievements || ''}
							readOnly
						/>
						<Textarea
							placeholder="Что можно сделать лучше"
							label="Пожелания"
							defaultValue={data.wishes || ''}
							readOnly
						/>
						<Textarea
							placeholder="Что получилось не очень"
							label="Замечания"
							defaultValue={data.remarks || ''}
							readOnly
						/>
						<Textarea
							placeholder="Любые комментарии"
							label="Комментарии"
							defaultValue={data.comment || ''}
							readOnly
						/>
					</Stack>
				</>
			) : (
				'Не удалось загрузить обратную связь'
			)}
		</Modal>
	)
}

export default FeedbackModal
