import { Select, SelectItem, Text } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { FC, forwardRef, useEffect, useState } from 'react'
import { QueryKeys, SearchUser, searchUserByFullname } from 'src/api'

type ItemProps = React.ComponentPropsWithoutRef<'div'> & SearchUser

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
	({ email, full_name, job_title, ...others }: ItemProps, ref) => (
		<div ref={ref} {...others}>
			<Text>
				{full_name} ({email})
			</Text>
			<Text size="xs">{job_title}</Text>
		</div>
	)
)
SelectItem.displayName = 'AutoCompleteItem'

interface Props {
	onChange: (value: string) => void
}

const UserSearchSelect: FC<Props> = ({ onChange }) => {
	const [value, setValue] = useState<string | null>(null)
	const [searchValue, onSearchChange] = useState('')
	const [debounced] = useDebouncedValue(searchValue, 300)

	const { data, refetch, isFetching, isSuccess } = useQuery({
		queryKey: [QueryKeys.SEARCH_USERS],
		queryFn: () => searchUserByFullname(debounced),
		enabled: Boolean(debounced),
	})

	function handleSelectChange(value: string | null) {
		setValue(value)
		onChange(value || '')
	}

	useEffect(() => {
		if (debounced) {
			refetch()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounced])

	return (
		<Select
			value={value}
			onChange={handleSelectChange}
			onSearchChange={onSearchChange}
			searchValue={searchValue}
			data={data || []}
			itemComponent={SelectItem}
			filter={(value, item: SelectItem & SearchUser) =>
				item.label.toLowerCase().includes(value.toLowerCase().trim())
			}
			nothingFound={
				isSuccess && !data?.length && !isFetching ? (
					<Text size="sm">Ничего не найдено</Text>
				) : isFetching ? (
					'Загрузка...'
				) : (
					'Начните вводить имя сотрудника'
				)
			}
			rightSection={null}
			rightSectionProps={{ style: { pointerEvents: 'all' } }}
			placeholder="Поиск сотрудника по имени"
			searchable
			clearable
		/>
	)
}

export default UserSearchSelect
