import {
	ActionIcon,
	Checkbox,
	Flex,
	Table as TableMantine,
	Text,
} from '@mantine/core'
import {
	ExpandedState,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	useReactTable,
	RowSelectionState,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { CareerTemplate } from 'shared/api/generatedTypes'
import { Icon } from 'shared/ui'
import tableStyles from 'shared/ui/Table/components/styles.module.sass'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys, getCareerTemplates } from 'shared/api'

const columnHelper = createColumnHelper<CareerTemplate>()

export default function CareerAddTemplate() {
	const { data, isLoading } = useQuery({
		queryKey: [QueryKeys.CAREER_TEMPLATES],
		queryFn: () => getCareerTemplates(),
	})

	const columns = useMemo(
		() => [
			columnHelper.accessor('name', {
				header: 'Название',
				cell: ({
					row: {
						getIsSelected,
						toggleSelected,
						getIsSomeSelected,
						depth,
						getIsAllSubRowsSelected,
					},
					getValue,
				}) => (
					<Flex gap="xl" pl={depth * 40}>
						<Checkbox
							checked={getIsAllSubRowsSelected() || getIsSelected()}
							onChange={() => toggleSelected()}
							indeterminate={getIsSomeSelected()}
						/>
						<Text>{getValue()}</Text>
					</Flex>
				),
			}),
			columnHelper.accessor('template', {
				header: 'Кол-во этапов',
				cell({ getValue }) {
					return getValue()?.length ?? ''
				},
			}),
			columnHelper.display({
				id: 'more',
				cell: ({
					row: { getIsExpanded, toggleExpanded, getCanExpand },
				}) => {
					if (!getCanExpand()) return null

					return (
						<Flex justify="end">
							<ActionIcon onClick={() => toggleExpanded()}>
								<Flex
									sx={() => ({
										transform: getIsExpanded()
											? 'rotate(180deg)'
											: undefined,
									})}
								>
									<Icon icon="keyboard_arrow_down" size={22} />
								</Flex>
							</ActionIcon>
						</Flex>
					)
				},
			}),
		],
		[]
	)

	const [expanded, setExpanded] = useState<ExpandedState>({})
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

	const table = useReactTable({
		data: data ?? [],
		columns,
		state: {
			expanded,
			rowSelection,
		},
		onExpandedChange: setExpanded,
		onRowSelectionChange: setRowSelection,
		//@ts-expect-error hack with column name
		getSubRows: row => row.template,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
	})

	//TODO add skeleton
	if (isLoading) return <Text>Загрузка</Text>
	if (data && data.length === 0) return <Text>Шаблонов нет</Text>

	return (
		<TableMantine
			sx={{
				tableLayout: 'fixed',
			}}
			className={tableStyles.table}
		>
			<thead>
				{table.getHeaderGroups().map(headerGroup => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map(header => {
							return (
								<th key={header.id} colSpan={header.colSpan}>
									{header.isPlaceholder ? null : (
										<div>
											{flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
										</div>
									)}
								</th>
							)
						})}
					</tr>
				))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map(row => {
					return (
						<tr key={row.id}>
							{row.getVisibleCells().map(cell => {
								return (
									<td key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</td>
								)
							})}
						</tr>
					)
				})}
			</tbody>
		</TableMantine>
	)
}
