import Icon from '@components/Icon'
import Table from '@components/Table'
import { Box, Container, Input, Title } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { getAllUsers, QueryKeys, searchUserByFullname } from 'src/api'
import { User } from 'src/api/generatedTypes'
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

			<Table table={table} />
		</Container>
	)
}

export default AdminCareer
