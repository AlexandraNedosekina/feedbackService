import { MultiSelect as MMultiSelect } from '@mantine/core'
import { useEffect, useState } from 'react'
import { TSearchUserAdapter } from 'shared/api'
import { TMultiSelectProps } from '../types'

export const MultiSelect = ({
	value: controlledValue,
	onChange,
	defaultValue,
	data,
	...props
}: TMultiSelectProps) => {
	const [value, setValue] = useState<string[]>(controlledValue || [])
	const [allCachedData, setAllCachedData] = useState<TSearchUserAdapter[]>([])

	function handleSelectChange(value: string[] | null) {
		setValue(value || [])
		if (onChange) {
			onChange(value || [])
		}
	}

	useEffect(() => {
		if (data) {
			setAllCachedData(prev => {
				const uniqueIds: string[] = []
				const newData = [...prev, ...data].filter(
					({ value }) =>
						!uniqueIds.includes(value) && uniqueIds.push(value)
				)
				return newData
			})
		}
	}, [data])

	return (
		<MMultiSelect
			value={value}
			defaultValue={defaultValue}
			onChange={handleSelectChange}
			data={allCachedData}
			{...props}
		/>
	)
}
