import { Table, Text } from '@mantine/core'
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { FC } from 'react'
import { Event, EventStatus } from 'src/api/generatedTypes'
import tableStyles from 'src/styles/table.module.sass'
import ActionMenuTable from './ActionMenuTable'

const columnHelper = createColumnHelper<Event>()

const columns = [
	columnHelper.accessor(
		row => {
			const parsedStartDate = dayjs(row.date_start).format(
				'DD.MM.YYYY HH:mm'
			)
			const parsedEndDate = dayjs(row.date_stop).format('DD.MM.YYYY HH:mm')

			return `${parsedStartDate} - ${parsedEndDate}`
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
	columnHelper.accessor(() => 'TODO', {
		id: 'qty',
		header: 'Кол-во участников',
	}),
	columnHelper.display({
		id: 'actions',
		cell: ({ row }) => <ActionMenuTable eventId={String(row.original.id)} />,
	}),
]

interface Props {
	data: Event[]
}

const EventsTable: FC<Props> = ({ data }) => {
	const table = useReactTable({
		data: data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
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
	)
}

export default EventsTable
