import Icon from '@components/Icon'
import { ActionIcon, Flex, Table } from '@mantine/core'
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { FC, useState } from 'react'
import { Colleagues } from 'src/api/generatedTypes'
import tableStyles from 'src/styles/table.module.sass'
import { useAdminUserCardContext } from 'src/utils/useAdminUserCardContext'

const columnHelper = createColumnHelper<Colleagues>()

const columns = [
	columnHelper.accessor('colleague.full_name', {
		header: 'Сотрудник',
	}),
	columnHelper.accessor('colleague.job_title', {
		header: 'Должность',
	}),
	columnHelper.display({
		id: 'add',
		cell: ({ row: { getIsSelected, getToggleSelectedHandler } }) => {
			return (
				<Flex justify="flex-end">
					<ActionIcon
						variant="light"
						color="brand.5"
						bg="brand.2"
						onClick={getToggleSelectedHandler()}
					>
						<Icon icon={getIsSelected() ? 'remove' : 'add'} />
					</ActionIcon>
				</Flex>
			)
		},
	}),
]

interface Props {
	isOnlySelectedColleagues: boolean
}

const ColleaguesTable: FC<Props> = ({ isOnlySelectedColleagues }) => {
	const { colleagues } = useAdminUserCardContext()
	const [rowSelection, setRowSelection] = useState({})

	const table = useReactTable({
		data: colleagues,
		columns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			rowSelection,
			globalFilter: isOnlySelectedColleagues,
		},
		onRowSelectionChange: setRowSelection,
		globalFilterFn: row => row.getIsSelected(),
		getFilteredRowModel: getFilteredRowModel(),
	})

	return (
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
	)
}

export default ColleaguesTable
