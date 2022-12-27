import Table from '@components/Table'
import UserRating from '@components/UserRating'
import { Flex } from '@mantine/core'
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { FC, useMemo, useState } from 'react'
import { Colleagues } from 'src/api/generatedTypes'
import ActionMenuTable from './ActionMenuTable'
import FeedbackModal from './FeedbackModal'
import MoreButton from './MoreButton'

const columnHelper = createColumnHelper<Colleagues & { feedbackId: number }>()

const data: (Colleagues & { feedbackId: number })[] = [
	{
		id: 1,
		owner_id: 1,
		colleague: {
			id: 1,
			full_name: 'Иванов Иван Иванович',
			job_title: 'Директор',
		},
		feedbackId: 1,
	},
	{
		id: 2,
		owner_id: 2,
		colleague: {
			id: 2,
			full_name: 'Test Test Test',
			job_title: 'Аналитик',
		},
		feedbackId: 2,
	},
	{
		id: 3,
		owner_id: 3,
		colleague: {
			id: 3,
			full_name: 'Test Test Test 2',
			job_title: 'Тестировщик',
		},
		feedbackId: 3,
	},
]

const ColleaguesTable: FC = () => {
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
				cell: () => {
					return (
						<Flex>
							<UserRating rating={4.8} withBorder />
						</Flex>
					)
				},
			}),
			columnHelper.display({
				id: 'more',
				cell: ({
					row: {
						original: { feedbackId },
					},
				}) => <MoreButton onClick={() => handleOpenFeedback(feedbackId)} />,
			}),
			columnHelper.display({
				id: 'actions',
				cell: ({
					row: {
						original: { id },
					},
				}) => {
					return <ActionMenuTable colleagueId={String(id)} />
				},
			}),
		],
		[]
	)

	const table = useReactTable({
		data,
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
