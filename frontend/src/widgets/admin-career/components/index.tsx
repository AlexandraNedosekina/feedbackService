import { Box, Input } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { getAllUsers, QueryKeys, searchUserByFullname } from 'shared/api'
import { User } from 'shared/api/generatedTypes'
import { Icon, Table } from 'shared/ui'
import GotoEditButton from './GotoEditButton'

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

export default () => {
	const [searchValue, setSearchValue] = useState<string>('')
	const [debounced] = useDebouncedValue(searchValue, 300)
	const { data: users } = useQuery({
		queryKey: [QueryKeys.USERS],
		queryFn: () => getAllUsers(),
	})
	const { data: searchUsers, refetch } = useQuery({
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
		<>
			<Box maw={400} my="lg">
				<Input
					value={searchValue}
					onChange={e => setSearchValue(e.target.value)}
					icon={<Icon icon="search" />}
					placeholder="Поиск"
				/>
			</Box>

			<Table table={table} />
		</>
	)
}
