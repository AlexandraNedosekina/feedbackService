import { Badge, Box, Button, Group, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { UserCard, UserRating } from 'entities/user'
import { Feedback } from 'shared/api/generatedTypes'
import FeedbackModal from './FeedbackModal'

interface IProps {
	feedback: Feedback
}

export function ArchiveItem({ feedback }: IProps) {
	const [isModalOpen, modalHandlers] = useDisclosure(false)

	return (
		<Box
			key={feedback.id}
			sx={theme => ({
				border: `1px solid ${theme.colors.gray[3]}`,
				borderRadius: '4px',
				padding: theme.spacing.md,
				marginBottom: theme.spacing.lg,
			})}
		>
			<Group position="apart">
				<UserCard
					key={feedback.id}
					name={feedback.sender.full_name}
					avatar={feedback.sender.avatar?.thumbnail_url}
					jobTitle={feedback.sender.job_title}
				/>
				<Badge>
					{feedback.event.name}
					{', '}
					{dayjs(feedback.event.date_start).format('DD.MM.YYYY')} -{' '}
					{dayjs(feedback.event.date_stop).format('DD.MM.YYYY')}
				</Badge>
			</Group>
			{feedback.avg_rating ? (
				<>
					<Group spacing={'xs'} my="sm">
						<Text color="dimmed">Оценка:</Text>
						<UserRating rating={feedback.avg_rating} withBorder />
					</Group>
					<Button onClick={modalHandlers.open} variant="light">
						Подробнее
					</Button>

					<FeedbackModal
						feedbackId={feedback.id}
						isOpen={isModalOpen}
						onClose={modalHandlers.close}
					/>
				</>
			) : (
				<Text mt="sm">Оценка не поставлена</Text>
			)}
		</Box>
	)
}
