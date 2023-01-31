import { Select, SelectItem, Text } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { FC, forwardRef, useEffect, useState } from 'react'
import { QueryKeys, TSearchUserAdapter, searchUserByFullname } from 'shared/api'

type ItemProps = React.ComponentPropsWithoutRef<'div'> & TSearchUserAdapter

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

interface IProps {
	value?: string
	onChange?: (value: string) => void
	placeholder?: string | null
}

export const UserSearchSelect = ({
	onChange,
	placeholder,
	value: controlledValue,
}: IProps) => {
	const [value, setValue] = useState<string | null>(controlledValue || null)
	const [searchValue, onSearchChange] = useState('')
	const [debounced] = useDebouncedValue(searchValue, 300)
	const [isLoading, setIsLoading] = useState(false)

	const { data, refetch, isFetching } = useQuery({
		queryKey: [QueryKeys.SEARCH_USERS],
		queryFn: () => searchUserByFullname(debounced),
		enabled: Boolean(debounced),
		keepPreviousData: true,
	})

	function handleSelectChange(value: string | null) {
		setValue(value)
		if (onChange) {
			onChange(value || '')
		}
	}

	useEffect(() => {
		if (debounced) {
			refetch()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounced])

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

	return (
		<Select
			value={value}
			onChange={handleSelectChange}
			onSearchChange={onSearchChange}
			searchValue={searchValue}
			data={data || []}
			itemComponent={SelectItem}
			filter={(value, item: SelectItem & TSearchUserAdapter) =>
				item.label.toLowerCase().includes(value.toLowerCase().trim())
			}
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
		/>
	)
}
