import { Text } from '@mantine/core'
import { forwardRef } from 'react'
import { TItemProps } from '../types'

export const SelectItem = forwardRef<HTMLDivElement, TItemProps>(
	({ email, full_name, job_title, ...others }: TItemProps, ref) => (
		<div ref={ref} {...others}>
			<Text>
				{full_name} ({email})
			</Text>
			<Text size="xs">{job_title}</Text>
		</div>
	)
)
SelectItem.displayName = 'AutoCompleteItem'
