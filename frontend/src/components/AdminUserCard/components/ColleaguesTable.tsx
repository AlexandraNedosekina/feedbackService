import Table from '@components/Table'
import UserRating from '@components/UserRating'
import { Flex } from '@mantine/core'
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { FC, useMemo, useState } from 'react'
import { IFeedbackStats } from 'src/types/feedbackStats'
import ActionMenuTable from './ActionMenuTable'
import FeedbackModal from './FeedbackModal'
import MoreButton from './MoreButton'

const columnHelper =
	createColumnHelper<IFeedbackStats['colleagues_rating'][number]>()

interface Props {
	colleagues: IFeedbackStats['colleagues_rating']
}

const ColleaguesTable: FC<Props> = ({ colleagues }) => {
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
			// accessor average rating
			columnHelper.display({
				id: 'average_rating',
				header: 'Оценка',
				cell: ({
					row: {
						original: { avg_rating },
					},
				}) => {
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
						original: { feedback_id: feedbackId },
					},
				}) => <MoreButton onClick={() => handleOpenFeedback(feedbackId)} />,
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
					return <ActionMenuTable colleagueId={String(id)} />
				},
			}),
		],
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
