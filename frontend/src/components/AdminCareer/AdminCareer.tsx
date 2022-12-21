import Icon from '@components/Icon'
import { Box, Container, Input, Table, Title } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { getAllUsers, QueryKeys, searchUserByFullname } from 'src/api'
import { User } from 'src/api/generatedTypes'
import tableStyles from 'src/styles/table.module.sass'
import { GotoEditButton } from './components'

const columnHelper = createColumnHelper<User>()

const columns = [
	columnHelper.accessor('full_name', {
		header: 'Сотрудник',
	}),
	columnHelper.accessor('job_title', {
		header: 'Должность',
		cell({ getValue }) {
			return getValue() || 'Не указана'
		},
	}),
	columnHelper.display({
		id: 'edit',
		cell: ({ row }) => <GotoEditButton id={row.original.id} />,
	}),
]

const AdminCareer = () => {
	const [searchValue, setSearchValue] = useState<string>('')
	const [debounced] = useDebouncedValue(searchValue, 300)
	const { data: users, isLoading } = useQuery({
		queryKey: [QueryKeys.USERS],
		queryFn: () => getAllUsers(),
	})
	const {
		data: searchUsers,
		isLoading: searchUsersLoading,
		refetch,
	} = useQuery({
		queryKey: [QueryKeys.SEARCH_USERS],
		queryFn: () => searchUserByFullname(debounced),
		enabled: !!debounced,
	})
	const searchUsersParsed = useMemo<User[]>(() => {
		return searchUsers?.map(user => user.original) || []
	}, [searchUsers])

	const table = useReactTable({
		data: debounced ? searchUsersParsed : users || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	useEffect(() => {
		if (debounced) {
			refetch()
		}
	}, [debounced, refetch])

	return (
		<Container pt="lg">
			<Title order={2}>Карьерный рост</Title>

			<Box maw={400} mt="lg">
				<Input
					value={searchValue}
					onChange={e => setSearchValue(e.target.value)}
					icon={<Icon icon="search" />}
					placeholder="Поиск"
				/>
			</Box>

			<Table className={tableStyles.table} mt="lg">
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
		</Container>
	)
}

export default AdminCareer
