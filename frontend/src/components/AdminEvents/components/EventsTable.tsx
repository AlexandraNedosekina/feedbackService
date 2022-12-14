import { Table, Text } from '@mantine/core'
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import 'dayjs/locale/ru'
import { FC } from 'react'
import { TEventAdapter } from 'src/api'
import { Event, EventStatus } from 'src/api/generatedTypes'
import tableStyles from 'src/styles/table.module.sass'
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
	data: TEventAdapter[]
}

const EventsTable: FC<Props> = ({ data }) => {
	const table = useReactTable({
		data,
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
