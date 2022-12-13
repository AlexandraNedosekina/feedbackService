import UserRating from '@components/UserRating'
import {
	Avatar,
	Button,
	Group,
	Rating,
	ScrollArea,
	Stack,
	Table,
	Text,
	Title,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import { getFeedback, getUsersColleagues, QueryKeys } from 'src/api'
import { Colleagues } from 'src/api/generatedTypes'
import tableStyles from 'src/styles/table.module.sass'
import styles from './AdminUserCard.module.sass'
import {
	AdminUserCardContext,
	IAdminUserCardContext,
} from './AdminUserCardContext'
import { ColleaguesTitle } from './components'

const columnHelper = createColumnHelper<Colleagues>()

const columns = [
	columnHelper.accessor('colleague.full_name', {
		header: 'Сотрудник',
	}),
	columnHelper.accessor('colleague.job_title', {
		header: 'Должность',
	}),
]

const AdminUserCard: FC = () => {
	const {
		query: { feedbackId },
	} = useRouter()

	const { data: feedbackData, isLoading } = useQuery({
		queryKey: [QueryKeys.FEEDBACK, +(feedbackId as string)],
		queryFn: () => getFeedback(+(feedbackId as string)),
		enabled: !!feedbackId,
	})
	const { data: colleagues, isLoading: isColleaguesLoading } = useQuery({
		queryKey: [QueryKeys.COLLEAGUES, feedbackData?.receiver.id],
		queryFn: () => getUsersColleagues(feedbackData?.receiver.id as number),
		enabled: !!feedbackData?.receiver.id,
	})

	const table = useReactTable({
		data: colleagues || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	const contextValue: IAdminUserCardContext = useMemo(
		() => ({
			colleagues: colleagues || [],
		}),
		[colleagues]
	)

	if (isLoading)
		return (
			<div className={styles.root}>
				<p>Загрузка...</p>
			</div>
		)

	return (
		<AdminUserCardContext.Provider value={contextValue}>
			<div className={styles.root}>
				<ScrollArea>
					<Group position="apart" align="flex-start">
						<Group>
							<Avatar src={null} size={64} radius={100} />
							<Stack spacing={5}>
								<Group spacing={'sm'}>
									<Title order={2} color="brand.5">
										{feedbackData?.receiver.full_name}
									</Title>
									{feedbackData?.avg_rating && (
										<UserRating rating={feedbackData.avg_rating} />
									)}
								</Group>
								<Text color="brand.5">
									{feedbackData?.receiver.job_title}
								</Text>
							</Stack>
						</Group>
						<Button variant="outline">Архив</Button>
					</Group>

					<Stack
						sx={() => ({
							maxWidth: 'max-content',
						})}
						my={40}
					>
						<Text size={14}>Средние значения</Text>
						<Group position="apart">
							<div>Выполнение задач</div>
							<Rating
								size="md"
								value={feedbackData?.task_completion}
								readOnly
							/>
						</Group>
						<Group position="apart">
							<div>Вовлеченность</div>
							<Rating
								size="md"
								value={feedbackData?.involvement}
								readOnly
							/>
						</Group>
						<Group position="apart">
							<div>Мотивация</div>
							<Rating
								size="md"
								value={feedbackData?.motivation}
								readOnly
							/>
						</Group>
						<Group position="apart">
							<div>Взаимодействие с командой</div>
							<Rating
								size="md"
								value={feedbackData?.interaction}
								readOnly
							/>
						</Group>
					</Stack>

					<ColleaguesTitle />

					{isColleaguesLoading ? (
						<p>Загрузка...</p>
					) : (
						<Table className={tableStyles.table}>
							<thead>
								{table.getHeaderGroups().map(headerGroup => (
									<tr key={headerGroup.id}>
										{headerGroup.headers.map(header => (
											<th key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
													  )}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody>
								{table.getRowModel().rows.map(row => (
									<tr key={row.id}>
										{row.getVisibleCells().map(cell => (
											<td key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</Table>
					)}
				</ScrollArea>
			</div>
		</AdminUserCardContext.Provider>
	)
}

export default AdminUserCard
