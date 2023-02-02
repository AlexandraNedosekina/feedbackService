import { Icon } from 'shared/ui'
import { Table } from 'shared/ui'
import { ActionIcon, Box, Button, Flex, Input, Text } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import {
	addColleagues,
	getUsersColleagues,
	QueryKeys,
	searchUserByFullname,
} from 'shared/api'
import { User } from 'shared/api/generatedTypes'
import { feedbackModel } from 'entities/feedback'
import shallow from 'zustand/shallow'

const columnHelper = createColumnHelper<User>()

interface IProps {
	onClose: () => void
}

const AddColleaguesModalView = ({ onClose }: IProps) => {
	const { selectedUserId } = feedbackModel.useAdminFeedbackStore(
		state => ({
			selectedUserId: state.userId,
		}),
		shallow
	)
	const [selected, setSelected] = useState<number[]>([])
	const [searchValue, setSearchValue] = useState<string>('')
	const [debounced] = useDebouncedValue(searchValue, 300)

	const { data: searchUsers, refetch } = useQuery({
		queryKey: [QueryKeys.SEARCH_USERS],
		queryFn: () => searchUserByFullname(debounced),
		enabled: !!debounced,
	})
	const { data: colleagues } = useQuery({
		queryKey: [QueryKeys.COLLEAGUES],
		queryFn: () => getUsersColleagues(+selectedUserId),
		enabled: !!selectedUserId,
	})

	const { mutate, isLoading } = useMutation({
		mutationFn: () =>
			addColleagues(
				+selectedUserId,
				new Set([
					...selected,
					...(colleagues?.map(colleague => colleague.colleague.id) || []),
				])
			),
		onSuccess: () => {
			onClose()
		},
	})

	const searchUsersParsed = useMemo<User[]>(() => {
		if (!colleagues || !searchUsers) return []

		const colleaguesIds = colleagues.map(colleague => colleague.colleague.id)
		return searchUsers
			.map(user => user.original)
			.filter(u => !colleaguesIds.includes(u.id) && +selectedUserId !== u.id)
	}, [colleagues, searchUsers, selectedUserId])

	const columns = useMemo(
		() => [
			columnHelper.accessor('full_name', {
				header: 'Сотрудник',
			}),
			columnHelper.accessor('job_title', {
				header: 'Должность',
				cell({ getValue }) {
					return getValue() || 'Не указана'
				},
			}),
			columnHelper.display({
				id: 'edit',
				cell: ({
					row: {
						original: { id },
					},
				}) => (
					<Flex justify="flex-end">
						<ActionIcon
							variant="light"
							color="brand.5"
							bg="brand.1"
							onClick={() => getToggleSelectedHandler(id)}
						>
							<Icon icon={selected.includes(id) ? 'remove' : 'add'} />
						</ActionIcon>
					</Flex>
				),
			}),
		],
		[selected]
	)

	const table = useReactTable({
		data: debounced ? searchUsersParsed : [] || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	})

	function getToggleSelectedHandler(id: number) {
		setSelected(prev => {
			if (prev.includes(id)) {
				return prev.filter(i => i !== id)
			} else {
				return [...prev, id]
			}
		})
	}

	function handleSave() {
		mutate()
	}

	useEffect(() => {
		if (debounced) {
			refetch()
		}
	}, [debounced, refetch])

	return (
		<>
			<Input
				value={searchValue}
				onChange={e => setSearchValue(e.target.value)}
				icon={<Icon icon="search" />}
				placeholder="Поиск"
			/>

			<Box my="lg">{debounced && <Table table={table} />}</Box>
			{!searchUsersParsed.length && debounced && (
				<Text>Ничего не найдено</Text>
			)}

			<Flex justify={'end'}>
				<Button
					onClick={handleSave}
					loading={isLoading}
					disabled={!selected.length}
				>
					Сохранить
				</Button>
			</Flex>
		</>
	)
}

export default AddColleaguesModalView
