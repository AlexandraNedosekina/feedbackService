import { Box, Button, Group, Input } from '@mantine/core'
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
import { Tabs } from '@mantine/core'

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
			<Tabs radius="md" defaultValue="gallery">
				<Tabs.List>
					<Tabs.Tab value="staff">Сотрудники</Tabs.Tab>
					<Tabs.Tab value="templates">Шаблоны</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="staff" pt="xs">
					<Table table={table} />
				</Tabs.Panel>

				<Tabs.Panel value="templates" pt="xs">
					<Group position="right" mt="xl">
						<Button
						// disabled={!valid}
						// onClick={handleSubmit}
						// loading={isLoading}
						>
							+ Создать
						</Button>
						<Table table={table} />
					</Group>
				</Tabs.Panel>
			</Tabs>
			{/* <Box maw={400} my="lg">
				<Input
					value={searchValue}
					onChange={e => setSearchValue(e.target.value)}
					icon={<Icon icon="search" />}
					placeholder="Поиск"
				/>
			</Box> */}
		</>
	)
}
