import Icon from '@components/Icon'
import { ActionIcon, createStyles, Group, Input, Title } from '@mantine/core'
import { useClickOutside, useFocusTrap } from '@mantine/hooks'
import { FC, useState } from 'react'
import { useAddCareerGrade } from 'src/stores'
import shallow from 'zustand/shallow'
import AddItem from './AddItem'

const useStyles = createStyles((_theme, _params, getRef) => ({
	actionIcon: {
		ref: getRef('actionIcon'),
		opacity: '0',
		transition: 'opacity 0.2s',
	},
	root: {
		'&:hover': {
			[`.${getRef('actionIcon')}`]: {
				opacity: '1',
			},
		},
	},
}))

interface Props {
	title: string
	type: 'toLearn' | 'toComplete'
}

const Tasks: FC<Props> = ({ title, type }) => {
	const { addParam, deleteParam, items, updateParam } = useAddCareerGrade(
		state => ({
			items: state[type],
			addParam: state.addParam,
			deleteParam: state.deleteParam,
			updateParam: state.updateParam,
		}),
		shallow
	)

	const [isEdit, setIsEdit] = useState(false)
	const [editIndex, setEditIndex] = useState<number>(0)
	const [updatedValue, setUpdatedValue] = useState<string>('')
	const editInputRef = useClickOutside(() => setIsEdit(false))
	const focusTrapRef = useFocusTrap()
	const { classes } = useStyles()

	function handleAdd(value: string) {
		addParam(type, value)
	}

	function handleDelete(id: string) {
		deleteParam(type, id)
	}

	function handleUpdate(id: string, value: string) {
		updateParam(type, id, value)
		setIsEdit(false)
	}

	function handleEdit(index: number) {
		setUpdatedValue(items[index].text)
		setIsEdit(true)
		setEditIndex(index)
	}

	return (
		<div>
			<Group h={40}>
				<Title size={14} fw={700}>
					{title}
				</Title>
				<AddItem onAdd={handleAdd} />
			</Group>

			<ul>
				{items.map((item, index) => {
					if (item.isDeleted) return

					return (
						<Group key={index} position="apart" className={classes.root}>
							<li>
								{isEdit && index === editIndex ? (
									<div ref={editInputRef}>
										<Input
											value={updatedValue}
											onChange={e =>
												setUpdatedValue(e.currentTarget.value)
											}
											onKeyUp={e => {
												if (e.key === 'Enter') {
													handleUpdate(item.id, updatedValue)
												}
											}}
											rightSection={
												<ActionIcon
													onClick={() =>
														handleUpdate(item.id, updatedValue)
													}
												>
													<Icon icon="done" />
												</ActionIcon>
											}
											size="xs"
											ref={focusTrapRef}
										/>
									</div>
								) : (
									item.text
								)}
							</li>
							<Group spacing={0}>
								<ActionIcon
									onClick={() => handleEdit(index)}
									className={classes.actionIcon}
									ml={'lg'}
								>
									<Icon icon="edit" />
								</ActionIcon>
								<ActionIcon
									onClick={() => handleDelete(item.id)}
									className={classes.actionIcon}
								>
									<Icon icon="delete" />
								</ActionIcon>
							</Group>
						</Group>
					)
				})}
			</ul>
		</div>
	)
}

export default Tasks
