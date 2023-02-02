import {
	ActionIcon,
	createStyles,
	Group,
	Input,
	Text,
	TextInput,
} from '@mantine/core'
import { useClickOutside, useFocusTrap } from '@mantine/hooks'
import { useState } from 'react'
import { Field } from 'react-final-form'
import { useFieldArray } from 'react-final-form-arrays'
import { Icon } from 'shared/ui'
import { ICareerGradeFormValues } from 'entities/career'
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

interface IProps {
	title: string
	type: 'toLearn' | 'toComplete'
}

const Tasks = ({ title, type }: IProps) => {
	const {
		fields,
		meta: { error, dirty, submitFailed },
	} = useFieldArray<ICareerGradeFormValues[typeof type][number]>(type)
	const { fields: deleleFields } = useFieldArray<string>('idsToDelete')
	const [isEdit, setIsEdit] = useState(false)
	const [editIndex, setEditIndex] = useState<number>(0)
	const [updatedValue, setUpdatedValue] = useState<string>('')
	const editInputRef = useClickOutside(() => setIsEdit(false))
	const focusTrapRef = useFocusTrap()
	const { classes } = useStyles()

	function handleAdd(value: string) {
		fields.push({ text: value })
	}

	function handleDelete(index: number) {
		const removed = fields.remove(index)

		if (removed.apiId) {
			deleleFields.push(removed.apiId)
		}
	}

	function handleUpdate(index: number, value: string) {
		const field = fields.value[index]
		fields.update(index, { ...field, text: value })
		setIsEdit(false)
	}

	function handleEdit(index: number) {
		const field = fields.value[index]
		setUpdatedValue(field.text)
		setIsEdit(true)
		setEditIndex(index)
	}

	return (
		<div>
			<Group h={40}>
				<TextInput
					label={title}
					withAsterisk
					styles={{ input: { display: 'none' } }}
				/>
				<AddItem onAdd={handleAdd} />
			</Group>
			{error && (dirty || submitFailed) ? (
				<Text size="sm" color="red">
					{error}
				</Text>
			) : null}
			{fields.map((name, index) => {
				return (
					<Group key={index} position="apart" className={classes.root}>
						<Field
							name={`${name}.text`}
							component="input"
							type="hidden"
						/>
						{isEdit && index === editIndex ? (
							<div ref={editInputRef}>
								<Input
									value={updatedValue}
									onChange={e =>
										setUpdatedValue(e.currentTarget.value)
									}
									onKeyUp={e => {
										if (e.key === 'Enter') {
											handleUpdate(index, updatedValue)
										}
									}}
									rightSection={
										<ActionIcon
											onClick={() =>
												handleUpdate(index, updatedValue)
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
							<>{fields.value[index].text}</>
						)}
						<Group spacing={0}>
							{!isEdit ? (
								<ActionIcon
									onClick={() => {
										handleEdit(index)
									}}
									className={classes.actionIcon}
									ml={'lg'}
								>
									<Icon icon="edit" />
								</ActionIcon>
							) : null}
							<ActionIcon
								onClick={() => {
									handleDelete(index)
								}}
								className={classes.actionIcon}
							>
								<Icon icon="delete" />
							</ActionIcon>
						</Group>
					</Group>
				)
			})}
		</div>
	)
}

export default Tasks
