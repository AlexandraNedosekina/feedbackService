import {
	ActionIcon,
	Button,
	Checkbox,
	Flex,
	Pagination,
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
	PaginationState,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { CareerTemplate } from 'shared/api/generatedTypes'
import { Icon } from 'shared/ui'
import tableStyles from 'shared/ui/Table/components/styles.module.sass'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QueryKeys, getCareerTemplates } from 'shared/api'
import { applyTemplates } from '../lib'
import { useRouter } from 'next/router'
import { showNotification } from '@mantine/notifications'

const PER_PAGE = 5
const columnHelper = createColumnHelper<CareerTemplate>()

interface IProps {
	onDone?: () => void
}

export default function CareerAddTemplate({ onDone }: IProps) {
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

	const {
		query: { id },
	} = useRouter()
	const queryClient = useQueryClient()

	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: PER_PAGE,
	})
	const [expanded, setExpanded] = useState<ExpandedState>({})
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

	const { data, isLoading, refetch } = useQuery({
		queryKey: [QueryKeys.CAREER_TEMPLATES],
		queryFn: () =>
			getCareerTemplates({
				limit: pagination.pageSize,
				skip: pagination.pageIndex * pagination.pageSize,
			}),
		keepPreviousData: true,
	})
	const { mutate, isLoading: isMutateLoading } = useMutation({
		mutationFn: (data: string[]) =>
			applyTemplates({
				userId: +(id as string),
				ids: data,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries([QueryKeys.CAREER_BY_USER_ID, id])
			showNotification({
				message: 'Успешно',
				color: 'green'
			})
			onDone?.()
		}
	})

	const table = useReactTable({
		data: data?.records ?? [],
		columns,
		state: {
			expanded,
			rowSelection,
			pagination,
		},
		onExpandedChange: setExpanded,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		//@ts-expect-error hack with column name
		getSubRows: row => row.template,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		manualPagination: true,
		getRowId(originalRow, index, parent) {
			return parent ? `${parent.original.id}.${index}` : `${originalRow.id}`
		},
	})

	useEffect(() => {
		refetch()
	}, [pagination, refetch])

	function handleSubmit() {
		mutate(Object.keys(rowSelection))
	}

	//TODO add skeleton
	if (isLoading) return <Text>Загрузка</Text>
	if (data && data.records.length === 0) return <Text>Шаблонов нет</Text>
	if (!data) return <Text>Нет данных</Text>

	return (
		<>
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
			<Pagination
				value={table.getState().pagination.pageIndex + 1}
				onChange={value => {
					table.setPageIndex(value - 1)
				}}
				total={Math.ceil(data.total_count / PER_PAGE)}
				mt="md"
			/>

			<Flex justify={'end'} mt="lg">
				<Button
					disabled={Object.keys(rowSelection).length === 0}
					onClick={handleSubmit}
					loading={isMutateLoading}
				>
					Сохранить
				</Button>
			</Flex>
		</>
	)
}
