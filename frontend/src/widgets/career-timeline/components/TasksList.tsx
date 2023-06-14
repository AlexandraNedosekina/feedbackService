import { List, Text } from '@mantine/core'
import { CareerParam } from 'shared/api/generatedTypes'
import { Icon } from 'shared/ui'

interface IProps {
	items: CareerParam[]
	title: string
}

export function TasksList({ items, title }: IProps) {
	if (!items?.length) return null

	return (
		<>
			<Text fz="md" mt={'md'} fw={500}>
				{title}
			</Text>
			<List>
				{items.map(item => (
					<List.Item
						key={item.id}
						icon={
							item.is_completed ? (
								<Text pt={2}>
									<Icon icon="done" />
								</Text>
							) : null
						}
						sx={theme => ({
							color: item.is_completed
								? theme.colors.green[7]
								: undefined,
							whiteSpace: 'pre-wrap',
						})}
					>
						{item.description}
					</List.Item>
				))}
			</List>
		</>
	)
}
