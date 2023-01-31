import { Icon } from 'shared/ui'
import { Badge, Flex, Text } from '@mantine/core'

export const CompletedBadge = () => {
	return (
		<Badge
			mt={20}
			leftSection={
				<Text color="green" size="lg">
					<Flex align="center">
						<Icon icon="done" />
					</Flex>
				</Text>
			}
			size="lg"
		>
			Оценено
		</Badge>
	)
}
