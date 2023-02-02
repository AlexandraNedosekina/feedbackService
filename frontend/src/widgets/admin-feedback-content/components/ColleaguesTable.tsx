import { Flex } from '@mantine/core'
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { UserRating } from 'entities/user'
import { useMemo, useState } from 'react'
import { IFeedbackStats } from 'shared/types'
import { Table } from 'shared/ui'
import ActionMenuTable from './ActionMenuTable'
import FeedbackModal from './FeedbackModal'
import MoreButton from './MoreButton'

const columnHelper =
	createColumnHelper<IFeedbackStats['colleagues_rating'][number]>()

interface IProps {
	colleagues: IFeedbackStats['colleagues_rating']
}

const ColleaguesTable = ({ colleagues }: IProps) => {
	const [feedbackId, setFeedbackId] = useState<number | null>(null)
	const [isOpen, setIsOpen] = useState(false)

	function handleOpenFeedback(id: number) {
		setFeedbackId(id)
		setIsOpen(true)
	}

	const columns = useMemo(
		() => [
			columnHelper.accessor('colleague.full_name', {
				header: 'Сотрудник',
			}),
			columnHelper.accessor('colleague.job_title', {
				header: 'Должность',
			}),
			columnHelper.display({
				id: 'average_rating',
				header: 'Оценка',
				cell: ({
					row: {
						original: { avg_rating },
					},
				}) => {
					if (!avg_rating) return 'Нет оценки'

					return (
						<Flex>
							<UserRating rating={avg_rating} withBorder />
						</Flex>
					)
				},
			}),
			columnHelper.display({
				id: 'more',
				cell: ({
					row: {
						original: { feedback_id: feedbackId, avg_rating },
					},
				}) => {
					if (!avg_rating) return null
					return (
						<MoreButton onClick={() => handleOpenFeedback(feedbackId)} />
					)
				},
			}),
			columnHelper.display({
				id: 'actions',
				cell: ({
					row: {
						original: {
							colleague: { id },
						},
					},
				}) => {
					return <ActionMenuTable colleagueId={id} />
				},
			}),
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	)

	const table = useReactTable({
		data: colleagues,
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<>
			<Table table={table} />
			<FeedbackModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				feedbackId={feedbackId}
			/>
		</>
	)
}

export default ColleaguesTable
