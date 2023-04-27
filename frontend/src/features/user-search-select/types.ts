import { MultiSelectProps, SelectProps } from '@mantine/core'
import { TSearchUserAdapter } from 'shared/api'

export interface ICommonSelectProps {
	placeholder?: string
	defaultValue?: string
	defaultData?: TSearchUserAdapter[]
}

export type TSelectProps = {
	value?: string | null
	onChange?: (value: string | null) => void
} & Partial<SelectProps> &
	ICommonSelectProps

export type TMultiSelectProps = {
	multi: true
	value?: string[]
	onChange?: (value: string[] | null) => void
} & Partial<MultiSelectProps> &
	ICommonSelectProps
