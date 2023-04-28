import { Select as MSelect } from '@mantine/core'
import { TSelectProps } from '../types'
import { useState } from 'react'
import { TSearchUserAdapter } from 'shared/api'
import { SelectItem } from '@mantine/core'

export const Select = ({
	value: controlledValue,
	defaultValue,
	onChange,
	defaultData = [],
	...props
}: TSelectProps) => {
	const [value, setValue] = useState<string | null>(controlledValue || null)

	function handleSelectChange(value: string | null) {
		setValue(value)
		if (onChange) {
			onChange(value || '')
		}
	}

	return (
		<MSelect
			value={value}
			defaultValue={defaultValue}
			onChange={handleSelectChange}
			filter={(value, item: SelectItem & TSearchUserAdapter) =>
				item.label.toLowerCase().includes(value.toLowerCase().trim())
			}
			data={defaultData}
			{...props}
		/>
	)
}
