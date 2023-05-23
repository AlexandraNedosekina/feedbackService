import { useQuery } from '@tanstack/react-query'
import {
	PaginationState,
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { QueryKeys, getCareerTemplates } from 'shared/api'
import { CareerTemplate } from 'shared/api/generatedTypes'
import { Icon, Table, TableSkeleton } from 'shared/ui'
import GotoEditButton from './GotoEditButton'
import {
	ActionIcon,
	Button,
	Flex,
	Group,
	Pagination,
	Text,
} from '@mantine/core'
import CreateTemplateModal from './CreateTemplateModal'
import { useDisclosure } from '@mantine/hooks'
import { useRouter } from 'next/router'
import DeleteTemplateModal from './DeleteTemplateModal'

const PER_PAGE = 5
const columnHelper = createColumnHelper<CareerTemplate>()

export default function TemplatesPanel() {
	const {
		query: { page },
	} = useRouter()

	const [selectedTemplateId, setSelectedTemplateId] = useState<number>()
	const [isCreateTemplateModalOpen, createTemplateModalHandlers] =
		useDisclosure(false)
	const [isDeleteTemplateModalOpen, deleteTemplateModalHandlers] =
		useDisclosure(false)

	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: page ? +page - 1 : 0,
		pageSize: PER_PAGE,
	})
	const { data, isLoading, refetch } = useQuery({
		queryKey: [QueryKeys.CAREER_TEMPLATES],
		queryFn: () =>
			getCareerTemplates({
				limit: pagination.pageSize,
				skip: pagination.pageIndex * pagination.pageSize,
			}),
		keepPreviousData: true,
	})
	const pagesCount = useMemo(() => {
		if (!data) return 0

		return Math.ceil(data.total_count / PER_PAGE)
	}, [data])

	const columns = useMemo(
		() => [
			columnHelper.accessor('name', {
				header: 'Название',
			}),
			columnHelper.accessor('template', {
				header: 'Кол-во этапов',
				cell({ getValue }) {
					return getValue().length
				},
			}),
			columnHelper.display({
				id: 'edit',
				cell: ({ row }) => (
					<Flex justify="end" gap={3}>
						<GotoEditButton
							href={`/career/template/${row.original.id}?page=${
								pagination.pageIndex + 1
							}`}
						/>
						<ActionIcon
							onClick={() => {
								deleteTemplateModalHandlers.open()
								setSelectedTemplateId(row.original.id)
							}}
						>
							<Icon icon="delete" />
						</ActionIcon>
					</Flex>
				),
			}),
		],
		[deleteTemplateModalHandlers, pagination.pageIndex]
	)

	const table = useReactTable({
		data: data?.records || [],
		columns,
		state: {
			pagination,
		},
		getCoreRowModel: getCoreRowModel(),
		onPaginationChange: setPagination,
		manualPagination: true,
	})

	useEffect(() => {
		refetch()
	}, [pagination, refetch])

	if (isLoading) {
		return <TableSkeleton />
	}

	return (
		<>
			<Group
				position={data?.records.length === 0 ? 'apart' : 'right'}
				my="lg"
			>
				{data?.records.length === 0 ? <Text>Шаблонов нет</Text> : null}
				<Button
					onClick={createTemplateModalHandlers.open}
					leftIcon={<Icon icon="add" />}
				>
					Создать
				</Button>
			</Group>

			{data?.records.length !== 0 ? <Table table={table} /> : null}

			<Pagination
				value={table.getState().pagination.pageIndex + 1}
				onChange={value => {
					table.setPageIndex(value - 1)
				}}
				total={pagesCount}
				mt="md"
			/>

			<CreateTemplateModal
				isOpen={isCreateTemplateModalOpen}
				onClose={createTemplateModalHandlers.close}
			/>

			<DeleteTemplateModal
				isOpen={isDeleteTemplateModalOpen}
				onClose={deleteTemplateModalHandlers.close}
				templateId={selectedTemplateId}
			/>
		</>
	)
}
