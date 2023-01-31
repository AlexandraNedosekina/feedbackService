import { Table } from 'shared/ui'
import { Box, Text } from '@mantine/core'
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import 'dayjs/locale/ru'
import { FC } from 'react'
import { TEventAdapter } from 'shared/api'
import { EventStatus } from 'shared/api/generatedTypes'
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

interface Props {
	data: TEventAdapter[]
}

const EventsTable: FC<Props> = ({ data }) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<Box mt="lg">
			<Table table={table} />
		</Box>
	)
}

export default EventsTable
