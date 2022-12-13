import AdminUserCard from '@components/AdminUserCard'
import { Box, Text } from '@mantine/core'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { AdminFeedbackLayout } from 'src/layouts'

const AdminFeedback: FC = () => {
	const {
		query: { feedbackId },
	} = useRouter()

	return (
		<AdminFeedbackLayout>
			{feedbackId ? (
				<AdminUserCard />
			) : (
				<Box
					sx={theme => ({
						height: '100%',
						padding: theme.spacing.xl,
						backgroundColor: 'white',
						borderRadius: '4px',
					})}
				>
					<Text color="brand" weight={600} size={19}>
						Выберите сотрудника для просмотра его оценок
					</Text>
				</Box>
			)}
		</AdminFeedbackLayout>
	)
}

export default AdminFeedback
