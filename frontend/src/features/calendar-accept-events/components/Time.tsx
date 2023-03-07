import { Box, Flex, Text } from '@mantine/core'
import dayjs from 'dayjs'
import { Icon } from 'shared/ui'

interface IProps {
	start: string
	end: string
}

export default function ({ end, start }: IProps) {
	const startTime = dayjs(start).format('hh:mm')
	const endTime = dayjs(end).format('hh:mm')
	const date = dayjs(start).format('D MMMM')

	return (
		<Flex
			align="center"
			gap={5}
			sx={theme => ({
				color: theme.colors.brand[5],
			})}
		>
			<Icon icon="calendar_month" />
			<Text color="dark" size="md">
				{date}, {startTime} - {endTime}
			</Text>
		</Flex>
	)
}
