import { Badge, Box, Group, Text, Title } from '@mantine/core'
import { ActionsMenu } from './components/ActionsMenu'

interface IProps {
	title: string
	salary?: number
	children?: React.ReactNode | React.ReactNode[]
	menuItems?: React.ReactNode
}

export default function GradeCard({
	title,
	salary,
	children,
	menuItems,
}: IProps) {
	return (
		<Box
			sx={theme => ({
				backgroundColor: theme.colors.brand[0],
				padding: theme.spacing.lg,
				marginTop: theme.spacing.lg,
				borderRadius: '4px',
				maxWidth: '600px',
			})}
		>
			<Group position="apart">
				<Title order={3} w={'80%'}>
					{title}
				</Title>
				{menuItems ? <ActionsMenu items={menuItems} /> : null}
			</Group>

			{salary ? (
				<Text>
					Зарплата:{' '}
					<Badge variant="outline" ml="md">
						{salary}
					</Badge>
				</Text>
			) : null}

			{children}
		</Box>
	)
}
