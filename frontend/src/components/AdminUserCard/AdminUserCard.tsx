import UserRating from '@components/UserRating'
import {
	Avatar,
	Button,
	Flex,
	Group,
	LoadingOverlay,
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
import { useAdminFeedbackStore } from 'src/stores'
import tableStyles from 'src/styles/table.module.sass'
import shallow from 'zustand/shallow'
import styles from './AdminUserCard.module.sass'
import {
	AdminUserCardContext,
	IAdminUserCardContext,
} from './AdminUserCardContext'
import { ColleaguesTitle } from './components'

const AdminUserCard = () => {
	const { eventId, userId } = useAdminFeedbackStore(
		state => ({
			eventId: state.eventId,
			userId: state.userId,
		}),
		shallow
	)

	// const { data: feedbackData, isLoading } = useQuery({
	// 	queryKey: [QueryKeys.FEEDBACK, +(feedbackId as string)],
	// 	queryFn: () => getFeedback(+(feedbackId as string)),
	// 	enabled: !!feedbackId,
	// })

	return (
		<div className={styles.root}>
			<LoadingOverlay visible={false} />

			{!userId && (
				<Flex align="center" justify="center" h="100%">
					<Text color="brand" weight={600} size={19}>
						Выберите сотрудника для просмотра его оценок
					</Text>
				</Flex>
			)}

			{userId && (
				<ScrollArea>
					<Group position="apart" align="flex-start">
						<Group>
							<Avatar src={null} size={64} radius={100} />
							<Stack spacing={5}>
								<Group spacing={'sm'}>
									<Title order={2} color="brand.5">
										Имя Фамилия
									</Title>
									<UserRating rating={4.75} />
								</Group>
								<Text color="brand.5">Должность</Text>
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
						{eventId === 'all' && <Text size={14}>Средние значения</Text>}
						<Group position="apart">
							<div>Выполнение задач</div>
							<Rating size="md" value={5} readOnly />
						</Group>
						<Group position="apart">
							<div>Вовлеченность</div>
							<Rating size="md" value={4} readOnly />
						</Group>
						<Group position="apart">
							<div>Мотивация</div>
							<Rating size="md" value={5} readOnly />
						</Group>
						<Group position="apart">
							<div>Взаимодействие с командой</div>
							<Rating size="md" value={5} readOnly />
						</Group>
					</Stack>

					<ColleaguesTitle />

					{/* {isColleaguesLoading ? (
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
					)} */}
				</ScrollArea>
			)}
		</div>
	)
}

export default AdminUserCard
