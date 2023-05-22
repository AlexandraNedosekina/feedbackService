import { Group, Modal, Select, Stack, Text, Textarea } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { UserRatingsByCategory } from 'features/user-ratings-by-category'
import { useEffect, useMemo, useState } from 'react'
import { QueryKeys, getFeedback, getFeedbackHistory } from 'shared/api'

interface IProps {
	isOpen: boolean
	onClose: () => void
	feedbackId: number | null
}

const FeedbackModal = ({ isOpen, onClose, feedbackId }: IProps) => {
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.FEEDBACK, feedbackId],
		queryFn: () => {
			if (!feedbackId) return null
			return getFeedback(feedbackId)
		},
		enabled: !!feedbackId,
	})
	const { data: history, isLoading: isHistoryLoading } = useQuery({
		queryKey: [QueryKeys.FEEDBACK_HISTORY, feedbackId],
		queryFn: () => {
			if (!feedbackId) return null
			return getFeedbackHistory(feedbackId)
		},
		enabled: !!feedbackId,
	})

	const [selectedFeedback, setSelectedFeedback] = useState<string>('default')
	const selectItems = useMemo(() => {
		if (!history) return []
		return [
			{
				label: 'Последняя оценка',
				value: 'default',
			},
			...history.map(item => ({
				label: dayjs(item.created_at + '+0000').format('hh:mm, DD.MM.YYYY'),
				value: String(item.id),
			})),
		]
	}, [history])
	const selectedFeedbackData = useMemo(() => {
		if (!history || !data) return null
		if (selectedFeedback === 'default') return data
		return history.find(item => item.id === Number(selectedFeedback))
	}, [history, selectedFeedback, data])

	useEffect(() => {
		if (isOpen) setSelectedFeedback('default')
	}, [isOpen])

	return (
		<Modal
			opened={isOpen}
			onClose={onClose}
			keepMounted={false}
			title={
				<Group position="apart" w={'100%'} pr="lg">
					<Text>Просмотр обратной связи</Text>
					<Select
						data={selectItems}
						value={selectedFeedback}
						onChange={value => setSelectedFeedback(value as string)}
					/>
				</Group>
			}
			styles={() => ({
				title: {
					flexGrow: 1,
				},
			})}
			size="xl"
		>
			{isLoading || isHistoryLoading ? (
				// TODO: add loading skeleton
				<p>Загрузка...</p>
			) : data ? (
				<>
					<Stack
						sx={() => ({
							maxWidth: 'max-content',
						})}
						my={'xl'}
					>
						<UserRatingsByCategory
							values={{
								'Выполнение задач':
									selectedFeedbackData?.task_completion || 0,
								Вовлеченность: selectedFeedbackData?.involvement || 0,
								Мотивация: selectedFeedbackData?.motivation || 0,
								'Взаимодействие с командой':
									selectedFeedbackData?.interaction || 0,
							}}
							readOnly
						/>
					</Stack>
					<Stack maw={'400px'} pb={1}>
						<Textarea
							placeholder="Опишите, какие успехи достигнуты"
							label="Достижения"
							value={selectedFeedbackData?.achievements || ''}
							readOnly
						/>
						<Textarea
							placeholder="Что можно сделать лучше"
							label="Пожелания"
							value={selectedFeedbackData?.wishes || ''}
							readOnly
						/>
						<Textarea
							placeholder="Что получилось не очень"
							label="Замечания"
							value={selectedFeedbackData?.remarks || ''}
							readOnly
						/>
						<Textarea
							placeholder="Любые комментарии"
							label="Комментарии"
							value={selectedFeedbackData?.comment || ''}
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
