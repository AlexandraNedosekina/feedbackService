import { Badge, Title } from '@mantine/core'
import { TCareerAdapter } from 'shared/api'
import { Timeline } from 'shared/ui'
import { TasksList } from './TasksList'

interface IProps {
	data: TCareerAdapter[]
}

export default ({ data }: IProps) => {
	const currentIndex = data.findIndex(i => i.is_current)

	return (
		<Timeline>
			{data.map((item, i) => (
				<Timeline.Item
					key={i}
					position={i % 2 === 0 ? 'left' : 'right'}
					bulletFilled={i <= currentIndex}
					lineFilled={i < currentIndex}
				>
					<Title order={4} color="brand.6">
						{item.name}
						{item.is_current && ', текущий уровень'}
					</Title>

					{item.salary ? (
						<Badge mt="sm">Зарплата {item.salary}</Badge>
					) : null}

					{!item.is_current && (
						<>
							<TasksList
								title="Что необходимо изучить:"
								items={item.toLearn}
							/>
							<TasksList
								title="Что необходимо сделать:"
								items={item.toComplete}
							/>
						</>
					)}
				</Timeline.Item>
			))}
		</Timeline>
	)
}
