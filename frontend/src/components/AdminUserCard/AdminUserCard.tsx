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
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { FC } from 'react'
import tableStyles from 'src/styles/table.module.sass'
import styles from './AdminUserCard.module.sass'

const columnHelper = createColumnHelper<{ name: string; age: number }>()

const columns = [
	columnHelper.accessor('name', {
		cell: name => name.getValue(),
		header: 'Name',
	}),
	columnHelper.accessor('age', {
		cell: age => age.getValue(),
		header: 'Age',
	}),
]

const data = [
	{ name: 'John', age: 20 },
	{ name: 'Jane', age: 21 },
	{ name: 'Jack', age: 22 },
	{ name: 'Jill', age: 23 },
	{ name: 'Jen', age: 24 },
	{ name: 'Jenny', age: 25 },
]

const AdminUserCard: FC = () => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<div className={styles.root}>
			<ScrollArea>
				<Group position="apart" align="flex-start">
					<Group>
						<Avatar src={null} size={64} radius={100} />
						<Stack spacing={5}>
							<Group spacing={'sm'}>
								<Title order={2} color="brand.5">
									Admin
								</Title>
								<UserRating rating={4.5} />
							</Group>
							<Text color="brand.5">Admin</Text>
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
						<Rating size="md" value={1} readOnly />
					</Group>
					<Group position="apart">
						<div>Вовлеченность</div>
						<Rating size="md" value={2} readOnly />
					</Group>
					<Group position="apart">
						<div>Мотивация</div>
						<Rating size="md" value={3} readOnly />
					</Group>
					<Group position="apart">
						<div>Взаимодействие с командой</div>
						<Rating size="md" value={4} readOnly />
					</Group>
				</Stack>

				<Title order={3}>Коллеги</Title>

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
			</ScrollArea>
		</div>
	)
}

export default AdminUserCard
