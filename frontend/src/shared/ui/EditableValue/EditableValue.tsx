import { ActionIcon, Input, InputProps } from '@mantine/core'
import { useClickOutside, useFocusTrap } from '@mantine/hooks'
import { ChangeEvent, useState } from 'react'
import { Icon } from '../Icon'

interface IProps {
	children: (props: { setActive: () => void }) => JSX.Element
	onSubmit?: (value: string) => void
	defaultValue?: string
	inputProps?: InputProps
	value?: string
	onChange?: (value: string) => void
	onClickOutside?: () => void
	submitDisabled?: boolean
}

export default function EditableValue({
	children,
	onSubmit,
	inputProps,
	value: controlledValue = '',
	onChange,
	onClickOutside,
	submitDisabled,
	defaultValue = '',
}: IProps) {
	const [isActive, setIsActive] = useState(false)
	const [value, setValue] = useState(defaultValue)
	const editInputRef = useClickOutside(() => {
		setIsActive(false)
		setValue(defaultValue)
		onClickOutside?.()
	})
	const focusTrapRef = useFocusTrap()

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (onChange) {
			onChange(e.currentTarget.value)
		} else {
			setValue(e.currentTarget.value)
		}
	}

	function handleSubmit() {
		onSubmit?.(value)
		setIsActive(false)
	}

	if (!isActive) {
		return children({ setActive: () => setIsActive(true) })
	}

	return (
		<div ref={editInputRef}>
			<Input
				value={controlledValue || value}
				onChange={handleChange}
				onKeyUp={e => {
					if (e.key === 'Enter' && !submitDisabled) {
						handleSubmit()
					}
				}}
				rightSection={
					<ActionIcon onClick={handleSubmit} disabled={submitDisabled}>
						<Icon icon="done" />
					</ActionIcon>
				}
				size="xs"
				{...inputProps}
				ref={focusTrapRef}
			/>
		</div>
	)
}
