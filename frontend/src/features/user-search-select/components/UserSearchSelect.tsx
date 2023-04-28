import { useDebouncedValue } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { QueryKeys, searchUserByFullname } from 'shared/api'
import { TMultiSelectProps, TSelectProps } from '../types'
import { MultiSelect } from './MultiSelect'
import { Select } from './Select'
import { SelectItem } from './SelectItem'
import { Text } from '@mantine/core'

type IProps = TSelectProps | TMultiSelectProps

const componentsMapper: Record<string, (props: any) => JSX.Element> = {
	multi: MultiSelect,
	select: Select,
}

function UserSearchSelect(props: TSelectProps): JSX.Element
function UserSearchSelect(props: TMultiSelectProps): JSX.Element
function UserSearchSelect({
	defaultData = [],
	placeholder,
	multi,
	...props
}: IProps): JSX.Element {
	const [searchValue, onSearchChange] = useState('')
	const [debounced] = useDebouncedValue(searchValue, 300)
	const [isLoading, setIsLoading] = useState(false)

	const { data, refetch, isFetching } = useQuery({
		queryKey: [QueryKeys.SEARCH_USERS],
		queryFn: () => searchUserByFullname(debounced),
		enabled: Boolean(debounced),
		keepPreviousData: true,
	})

	useEffect(() => {
		if (debounced) {
			refetch()
		}
	}, [debounced, refetch])

	useEffect(() => {
		if (searchValue) {
			setIsLoading(true)
		}

		const timeout = setTimeout(() => {
			setIsLoading(false)
		}, 400)

		return () => {
			clearTimeout(timeout)
		}
	}, [searchValue])

	const Component = componentsMapper[multi ? 'multi' : 'select']

	return (
		<Component
			searchValue={searchValue}
			onSearchChange={onSearchChange}
			data={data || defaultData}
			itemComponent={SelectItem}
			nothingFound={
				data?.length === 0 && !isLoading ? (
					<Text size="sm">Ничего не найдено</Text>
				) : isLoading || isFetching ? (
					'Загрузка...'
				) : (
					'Начните вводить имя сотрудника'
				)
			}
			rightSection={null}
			rightSectionProps={{ style: { pointerEvents: 'all' } }}
			placeholder={
				placeholder === null
					? undefined
					: placeholder || 'Введите имя сотрудника'
			}
			searchable
			clearable
			withinPortal
			zIndex={1000}
			{...props}
		/>
	)
}

export default UserSearchSelect
