import { ActionIcon, Group, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { careerModel } from 'entities/career'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getCareerTemplateById, QueryKeys } from 'shared/api'
import { Icon } from 'shared/ui'
import shallow from 'zustand/shallow'
import { CareerChips } from 'entities/career'
import GradeCard from './GradeCard'
import { templateGradeModel } from 'features/career-grade'
import { TemplateTitle } from './TemplateTitle'
import { Text } from '@mantine/core'

export default () => {
	const { update } = careerModel.useEdit(
		state => ({
			selectedGradeId: state.selectedGradeId,
			update: state.update,
		}),
		shallow
	)
	const updateTemplate = templateGradeModel.useTemplateStore(
		state => state.update
	)
	const {
		query: { id, page },
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
			}))

			update({
				grades,
				selectedGradeId:
					grades.length > 0 ? String(grades.length - 1) : undefined,
			})
			updateTemplate({
				template: data,
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
			<Group spacing={3}>
				<Link
					href={{
						pathname: '/career',
						query: {
							from: 'template',
							page,
						},
					}}
				>
					<ActionIcon>
						<Icon icon="arrow_back_ios_new" size={14} />
					</ActionIcon>
				</Link>
				<Text>Редактирование шаблона</Text>
			</Group>
			{isLoading ? (
				// TODO: add skeleton
				<div>Загрузка...</div>
			) : data ? (
				<>
					<TemplateTitle text={data.name} />
					<CareerChips
						type="template"
						addSection={({ openModal }) => (
							<ActionIcon
								variant="light"
								color="brand.6"
								size="lg"
								onClick={openModal}
							>
								<Icon icon="add" size={22} />
							</ActionIcon>
						)}
					/>
					{data && data.template.length > 0 ? (
						<GradeCard />
					) : (
						<Title order={4} mt="sm">
							Создайте первый этап
						</Title>
					)}
				</>
			) : null}
		</>
	)
}
