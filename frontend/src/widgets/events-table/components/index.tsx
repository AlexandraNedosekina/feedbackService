import { Box } from '@mantine/core'
import { Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { getAllEvents, QueryKeys, TEventAdapter } from 'shared/api'
import { EventStatus } from 'shared/api/generatedTypes'
import { Table } from 'shared/ui'
import ActionMenuTable from './ActionMenuTable'

const columnHelper = createColumnHelper<TEventAdapter>()

const columns = [
	columnHelper.accessor(
		row => {
			return `${row.parsedStartDate} - ${row.parsedEndDate}`
		},
		{
			id: 'date',
			header: 'Дата',
		}
	),
	columnHelper.accessor('status', {
		cell: ({ getValue }) => {
			switch (getValue()) {
				case EventStatus.Archived:
					return <Text color="orange">Завершено</Text>
				case EventStatus.Active:
					return <Text color="green">Активно</Text>
				case EventStatus.Waiting:
					return <Text color="brand">Запланировано</Text>
				default:
					return 'Неизвестно'
			}
		},
		header: 'Статус',
	}),
	// columnHelper.accessor(() => 'TODO', {
	// 	id: 'qty',
	// 	header: 'Кол-во участников',
	// }),
	columnHelper.display({
		id: 'actions',
		cell: ({ row }) => <ActionMenuTable eventId={String(row.original.id)} />,
	}),
]

export default () => {
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.EVENTS],
		queryFn: getAllEvents,
	})

	const table = useReactTable({
		data: data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	if (isLoading) return <div>Загрузка...</div>

	return (
		<Box mt="lg">
			<Table table={table} />
		</Box>
	)
}
