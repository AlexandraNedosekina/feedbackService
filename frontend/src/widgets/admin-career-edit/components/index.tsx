import { ActionIcon, Box, Group, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { CareerChips, careerModel } from 'entities/career'
import { UserCard } from 'entities/user'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { QueryKeys, getCareerByUserId, getUserById } from 'shared/api'
import { Icon } from 'shared/ui'
import shallow from 'zustand/shallow'
import { AddSection } from './AddSection'
import { AddTemplateModal } from './AddTemplateModal'
import GradeCard from './GradeCard'

export default () => {
	const { selectedGradeId, update } = careerModel.useEdit(
		state => ({
			selectedGradeId: state.selectedGradeId,
			update: state.update,
		}),
		shallow
	)
	const {
		query: { id },
	} = useRouter()
	const router = useRouter()

	const [isAddTemplateModalOpen, addTemplateModalHandlers] =
		useDisclosure(false)

	const { data: user, isLoading: isUserLoading } = useQuery({
		queryKey: [QueryKeys.USER, id],
		queryFn: () => getUserById(id as string),
		enabled: !!id,
		retry(failureCount, error: any) {
			if (error.code === 404) {
				router.push('/career')
			}
			if (failureCount === 3) return false
			return true
		},
	})
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.CAREER_BY_USER_ID, id],
		queryFn: () => getCareerByUserId(id as string),
		enabled: !!id,
		onSuccess: data => {
			const defaultGradeId = data.find(i => i.is_current)?.id

			const grades = data.map(item => ({
				label: item.name || '',
				value: item.id,
				isCompleted: item.is_completed,
				isCurrent: item.is_current,
			}))

			update({ grades })
			if (
				!selectedGradeId ||
				!data.some(i => String(i.id) === selectedGradeId)
			) {
				update({ selectedGradeId: String(defaultGradeId) })
			}
		},
	})

	return (
		<>
			<Group spacing={3}>
				<Link href="/career">
					<ActionIcon>
						<Icon icon="arrow_back_ios_new" size={14} />
					</ActionIcon>
				</Link>
				<Text>Редактирование карьерного роста</Text>
			</Group>

			{isUserLoading ? (
				<div>Загрузка...</div>
			) : (
				<Box mt="xl">
					<UserCard
						name={user?.full_name || ''}
						jobTitle={user?.job_title}
						avatar={user?.avatar?.thumbnail_url || ''}
					/>
				</Box>
			)}

			{isLoading ? (
				// TODO: add skeleton
				<div>Загрузка...</div>
			) : (
				<>
					<CareerChips
						type="personal"
						addSection={({ openModal }) => (
							<AddSection
								openAddGradeModal={openModal}
								openAddTemplateModal={addTemplateModalHandlers.open}
							/>
						)}
					/>
					{data && data.length > 0 ? (
						<GradeCard />
					) : (
						<Title order={4} mt="sm">
							Создайте первый карьерный план
						</Title>
					)}
				</>
			)}

			<AddTemplateModal
				isOpen={isAddTemplateModalOpen}
				onClose={addTemplateModalHandlers.close}
			/>
		</>
	)
}
