import { Badge, Text, Title } from '@mantine/core'
import { TCareerAdapter } from 'shared/api'
import { Timeline } from 'shared/ui'

interface IProps {
	data: TCareerAdapter[]
}

export default ({ data }: IProps) => {
	return (
		<Timeline>
			{data.map((item, i) => (
				<Timeline.Item
					key={i}
					isCurrent={item.is_current}
					position={i % 2 === 0 ? 'left' : 'right'}
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
							{item.toLearn.length > 0 && (
								<>
									<Text fz="md" mt={'md'} fw={500}>
										Что необходимо изучить:
									</Text>
									<ul>
										{item.toLearn.map(item => (
											<li key={item.id}>{item.description}</li>
										))}
									</ul>
								</>
							)}
							{item.toComplete.length > 0 && (
								<>
									<Text fz="md" mt={6} fw={500}>
										Что необходимо сделать:
									</Text>
									<ul>
										{item.toComplete.map(item => (
											<li key={item.id}>{item.description}</li>
										))}
									</ul>
								</>
							)}
						</>
					)}
				</Timeline.Item>
			))}
		</Timeline>
	)
}
