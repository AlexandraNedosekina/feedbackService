import { Icon } from 'shared/ui'
import Table from '@components/Table'
import { ActionIcon, Flex } from '@mantine/core'
import {
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { FC, useState } from 'react'
import { Colleagues } from 'shared/api/generatedTypes'
import { useAdminUserCardContext } from 'utils/useAdminUserCardContext'

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

	return <Table table={table} />
}

export default ColleaguesTable
