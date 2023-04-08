import { ActionIcon, Box, Group, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { careerModel } from 'entities/career'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getCareerTemplateById, QueryKeys } from 'shared/api'
import { Icon } from 'shared/ui'
import shallow from 'zustand/shallow'
import { CareerChips } from 'entities/career'
import GradeCard from './GradeCard'

export default () => {
	const { update } = careerModel.useEdit(
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

	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.CAREER_TEMPLATE_BY_ID, id],
		queryFn: () => getCareerTemplateById(id as string),
		enabled: !!id,
		onSuccess: data => {
			const grades = data.template.map((item, i) => ({
				label: item.name || '',
				value: i,
				isDefault: i === 0,
			}))

			update({
				grades,
				selectedGradeId: grades.length > 0 ? 0 : undefined,
			})
		},
		retry(failureCount, error: any) {
			if (error.code === 404) {
				router.push('/career')
			}
			if (failureCount === 3) return false
			return true
		},
	})

	return (
		<>
			<Group spacing="xs">
				<Link href="/career">
					<ActionIcon>
						<Icon icon="arrow_back_ios_new" />
					</ActionIcon>
				</Link>
				<Title order={2}>Редактирование шаблона</Title>
			</Group>
			<Box mt="xl">
				<Title order={2}>{data?.name}</Title>
			</Box>
			{isLoading ? (
				// TODO: add skeleton
				<div>Загрузка...</div>
			) : (
				<>
					<CareerChips type="personal" />
					{data && data.template.length > 0 ? (
						<GradeCard />
					) : (
						<Title order={4} mt="sm">
							Создайте первый этап
						</Title>
					)}
				</>
			)}{' '}
		</>
	)
}
