import Icon from '@components/Icon'
import { ActionIcon, createStyles, Group, Title } from '@mantine/core'
import { FC, useEffect, useState } from 'react'
import { useAddCareerGrade } from 'src/stores'
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
	const [items, setItems] = useState<string[]>([])
	const { classes } = useStyles()
	const update = useAddCareerGrade(state => state.update)

	function handleDelete(index: number) {
		const newItems = [...items]
		newItems.splice(index, 1)
		setItems(newItems)
	}

	useEffect(() => {
		update({ [type]: items })
	}, [items, type, update])

	return (
		<div>
			<Group>
				<Title size={14} fw={700}>
					{title}
				</Title>
				<AddItem onAdd={value => setItems([...items, value])} />
			</Group>

			<ul>
				{items.map((item, index) => (
					<Group key={index} spacing="lg" className={classes.root}>
						<li>{item}</li>
						<ActionIcon
							onClick={() => handleDelete(index)}
							className={classes.actionIcon}
						>
							<Icon icon="delete" />
						</ActionIcon>
					</Group>
				))}
			</ul>
		</div>
	)
}

export default Tasks
