import { ActionIcon, Input } from '@mantine/core'
import { useClickOutside, useFocusTrap } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { Icon } from 'shared/ui'

interface IProps {
	onAdd?: (value: string) => void
}

const AddItem = ({ onAdd }: IProps) => {
	const [isEdit, setIsEdit] = useState(false)
	const [value, setValue] = useState('')
	const editInputRef = useClickOutside(() => setIsEdit(false))
	const focusTrapRef = useFocusTrap()

	function handleSetEdit() {
		setIsEdit(true)
	}

	function handleAdd() {
		if (!value.trim()) return
		if (onAdd) onAdd(value.trim())
		setValue('')
		setIsEdit(false)
	}

	useEffect(() => {
		setValue('')
	}, [isEdit])

	if (isEdit) {
		return (
			<div ref={editInputRef}>
				<Input
					value={value}
					onChange={e => setValue(e.currentTarget.value)}
					onKeyUp={e => {
						if (e.key === 'Enter') handleAdd()
					}}
					rightSection={
						<ActionIcon onClick={handleAdd}>
							<Icon icon="add" />
						</ActionIcon>
					}
					ref={focusTrapRef}
				/>
			</div>
		)
	}

	return (
		<ActionIcon onClick={handleSetEdit} variant="light" color="brand">
			<Icon icon="add" />
		</ActionIcon>
	)
}

export default AddItem
