import { Table as TableMantine } from '@mantine/core'
import { flexRender, Table as ITable } from '@tanstack/react-table'
import tableStyles from './styles.module.sass'

interface IProps {
	table: ITable<any>
}

const Table = ({ table }: IProps) => {
	return (
		<TableMantine className={tableStyles.table}>
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
		</TableMantine>
	)
}

export default Table
