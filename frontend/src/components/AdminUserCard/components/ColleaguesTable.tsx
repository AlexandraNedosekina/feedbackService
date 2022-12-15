import Table from '@components/Table'
import UserRating from '@components/UserRating'
import { Flex } from '@mantine/core'
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { FC } from 'react'
import { Colleagues } from 'src/api/generatedTypes'
import ActionMenuTable from './ActionMenuTable'

const columnHelper = createColumnHelper<Colleagues>()

const data: Colleagues[] = [
	{
		id: 1,
		owner_id: 1,
		colleague: {
			id: 1,
			full_name: 'Иванов Иван Иванович',
			job_title: 'Директор',
		},
	},
	{
		id: 2,
		owner_id: 2,
		colleague: {
			id: 2,
			full_name: 'Test Test Test',
			job_title: 'Аналитик',
		},
	},
	{
		id: 3,
		owner_id: 3,
		colleague: {
			id: 3,
			full_name: 'Test Test Test 2',
			job_title: 'Тестировщик',
		},
	},
]

const columns = [
	columnHelper.accessor('colleague.full_name', {
		header: 'Сотрудник',
	}),
	columnHelper.accessor('colleague.job_title', {
		header: 'Должность',
	}),
	// accessor average rating
	columnHelper.display({
		id: 'average_rating',
		header: 'Оценка',
		cell: () => {
			return (
				<Flex>
					<UserRating rating={4.8} withBorder />
				</Flex>
			)
		},
	}),
	columnHelper.display({
		id: 'actions',
		cell: ({
			row: {
				original: { id },
			},
		}) => {
			return <ActionMenuTable colleagueId={String(id)} />
		},
	}),
]

const ColleaguesTable: FC = () => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return <Table table={table} />
}

export default ColleaguesTable
